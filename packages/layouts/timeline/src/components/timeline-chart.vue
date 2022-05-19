<template>
  <div id="timeline-layout">
    <div v-if="!!groupField" class="grid-sidebar">
      <div
        v-for="groupName in Object.keys(groupItems)"
        :key="`row-${groupName}`"
        class="group"
      >
        <render-display
          v-if="!!groupFieldConfig?.meta.display"
          :value="groupName"
          :display="groupFieldConfig?.meta.display"
          :options="groupFieldConfig?.meta.display_options"
          :interface="groupFieldConfig?.meta.interface"
          :interface-options="groupFieldConfig?.meta.options"
          :type="groupFieldConfig?.type"
          :collection="collection"
          :field="groupFieldConfig?.field"
        />
        <span v-else>{{ groupName }}</span>
      </div>
    </div>
    <div ref="grid" class="grid">
      <div class="grid-header" :style="`width: ${colWidth * dates.length}px`">
        <div
          v-for="(header, i) in headers"
          :key="`header-${i}`"
          align="center"
          class="cell"
          :style="`width: ${colWidth * header.ranges.length}px`"
        >
          <template v-if="header.groupLabel">
            <small class="text-gray">{{ header.groupLabel }}</small>
            <br />
          </template>

          <strong>{{ header.label }}</strong>
        </div>
      </div>

      <div class="grid-body" :style="`width: ${colWidth * dates.length}px`">
        <div
          v-for="groupName in Object.keys(groupItems)"
          :key="`row-${groupName}`"
          class="row"
        >
          <div
            class="row-grid"
            :style="`grid-template-columns: repeat(${dates.length}, ${colWidth}px)`"
          >
            <div
              v-for="(item, i) in groupItems[groupName]"
              :key="`item-${i}`"
              class="item clickable"
              :style="getItemStyles(item)"
              @mouseover="onMouseOverItem($event, item)"
              @mousemove="onMouseMoveItem($event)"
              @mouseout="onMouseOutItem"
              @click="
                router.push({
                  name: 'content-item',
                  params: { collection: collection, primaryKey: item.id },
                })
              "
            >
              <v-avatar
                v-if="userField && colWidth > 28"
                class="avatar"
                style="--v-avatar-size: 20px"
              >
                <img
                  v-if="avatarSrc(item[userField])"
                  :src="avatarSrc(item[userField])"
                />
                <v-icon v-else name="person_outline" />
              </v-avatar>
              <div class="title">{{ item[titleField] }}</div>
            </div>
          </div>
        </div>

        <div v-show="isOnHover" ref="tooltip" class="item-toolip">
          <template v-if="!!hoveringItem">
            <div class="mb-5">
              <strong>{{ hoveringItem[titleField] }}</strong>
            </div>
            <div>
              <v-chip
                v-for="tag in hoveringItem[tagField] || []"
                :key="tag"
                x-small
                class="mr-5 mb-5"
              >
                {{ tag }}
              </v-chip>
            </div>
            <div class="text-gray mb-5 t12">
              {{
                hoveringItem[startDateField]
                  ? formatDate(
                      new Date(hoveringItem[startDateField]),
                      "dd MMM yyyy"
                    )
                  : "/"
              }}
              -
              {{
                hoveringItem[endDateField]
                  ? formatDate(
                      new Date(hoveringItem[endDateField]),
                      "dd MMM yyyy"
                    )
                  : "Endless"
              }}
            </div>
            <div class="d-flex">
              <v-avatar
                v-if="userField && viewMode !== 'year'"
                class="avatar mr-5"
                x-small
                :size="20"
              >
                <img
                  v-if="avatarSrc(hoveringItem[userField])"
                  :src="avatarSrc(hoveringItem[userField])"
                />
                <v-icon v-else name="person_outline" />
              </v-avatar>
              <span v-if="!!hoveringItem[userField]" class="t12">{{
                `${hoveringItem[userField].email}`
              }}</span>
            </div>
          </template>
        </div>
      </div>

      <div class="grid-columns">
        <div
          v-for="(date, i) in dates"
          :key="`body-${i}`"
          class="column"
          :style="`left: ${colWidth * i}px; width: ${colWidth}px`"
          :class="{
            weekend: [0, 6].includes(date.getDay()) && viewMode !== 'year',
            today: date.toDateString() == today.toDateString(),
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Item } from "@directus/shared/types";
import { useRouter } from "vue-router";
import {
  format,
  isLastDayOfMonth,
  lastDayOfYear,
  differenceInCalendarDays,
} from "date-fns";
import { addQueryToPath, getRootPath } from "../utils/functions";

export default defineComponent({
  inject: ["api", "stores"],
  inheritAttrs: false,
  props: {
    collection: {
      type: String,
      required: true,
    },
    layoutOptions: {
      type: Object,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    viewMode: {
      type: String as PropType<"day" | "week" | "month" | "year">,
      required: true,
    },
    zoom: {
      type: Number,
      default: 1,
    },
    items: {
      type: Array as PropType<Item[]>,
      required: true,
    },
    conditionalStyles: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const router = useRouter();
    const formatDate = format;

    return { router, formatDate };
  },
  data() {
    return {
      isLoading: false,
      isOnHover: false,
      hoveringItem: null,
    };
  },
  computed: {
    startDateField() {
      return this.layoutOptions?.startDateField;
    },
    endDateField() {
      return this.layoutOptions?.endDateField;
    },
    groupField() {
      return this.layoutOptions?.groupField;
    },
    titleField() {
      return this.layoutOptions?.titleField;
    },
    userField() {
      return this.layoutOptions?.userField;
    },
    tagField() {
      return this.layoutOptions?.tagField;
    },
    colWidth() {
      const widths = {
        day: 80,
        week: 44,
        month: 10,
        year: 2,
      };
      return Math.abs(widths[this.viewMode] * this.zoom);
    },
    groupWidth() {
      return 150;
    },
    groupFieldConfig() {
      if (!this.groupField) return null;

      const fieldsStore = this.stores.useFieldsStore();
      const config = fieldsStore.getField(this.collection, this.groupField);
      return config;
    },
    dates() {
      const dates = [];
      let start = new Date(this.startDate);
      let end = new Date(this.endDate);
      while (start <= end) {
        dates.push(start);
        start = new Date(start.getTime() + 24 * 60 * 60 * 1000);
      }
      return dates;
    },
    headers() {
      const headers = [];
      let start = 0;

      switch (this.viewMode) {
        case "week":
          this.dates.forEach((date, index) => {
            if (date.getDay() === 0 || this.dates.length === index + 1) {
              headers.push({
                ranges: this.dates.slice(start, index + 1),
                label: `${this.dates[start].getDate()} - ${this.dates[
                  index
                ].getDate()}`,
                groupLabel: format(this.dates[index], "MMMM"),
              });
              start = index + 1;
            }
          });
          break;

        case "month":
          this.dates.forEach((date, index) => {
            if (isLastDayOfMonth(date) || this.dates.length === index + 1) {
              headers.push({
                ranges: this.dates.slice(start, index + 1),
                label: format(this.dates[start], "MMMM"),
                groupLabel: format(this.dates[index], "yyyy"),
              });
              start = index + 1;
            }
          });
          break;

        case "year":
          this.dates.forEach((date, index) => {
            if (
              lastDayOfYear(date).toDateString() === date.toDateString() ||
              this.dates.length === index + 1
            ) {
              headers.push({
                ranges: this.dates.slice(start, index + 1),
                label: this.dates[start].getFullYear(),
                groupLabel: "",
              });
              start = index + 1;
            }
          });
          break;

        default:
          this.dates.forEach((date) => {
            headers.push({
              ranges: [date],
              label: `${format(date, "EEEEE")} ${date.getDate()}`,
              groupLabel: format(date, "MMM"),
            });
          });
          break;
      }

      return headers;
    },
    visibleItems() {
      const startTime = new Date(this.startDate).getTime();
      const endTime = new Date(this.endDate).getTime();
      return this.items.filter((item) => {
        if (item[this.startDateField] && item[this.endDateField]) {
          const itemStartTime = new Date(item[this.startDateField]).getTime();
          const itemEndTime = new Date(item[this.endDateField]).getTime();
          return itemStartTime <= endTime && itemEndTime >= startTime;
        }
        if (item[this.startDateField]) {
          const itemStartTime = new Date(item[this.startDateField]).getTime();
          return itemStartTime <= endTime;
        }
        return false;
      });
    },
    groupItems() {
      const groupItems = {};

      // init default group;
      if (this.groupFieldConfig?.meta?.options?.choices) {
        const choices = this.groupFieldConfig?.meta?.options?.choices;
        choices.forEach((item) => {
          groupItems[item.value] = [];
        });
      }

      // add items into group
      this.visibleItems.forEach((item) => {
        const group = item[this.groupField] || "";
        if (groupItems[group]) {
          groupItems[group].push(item);
        } else {
          groupItems[group] = [item];
        }
      });

      if (Object.keys(groupItems).length == 0) {
        groupItems[""] = [];
      }

      return groupItems;
    },
    today() {
      return new Date();
    },
  },
  watch: {
    viewMode: function () {
      this.$nextTick(() => {
        this.scrollToToday();
      });
    },
    startDate: function (value, newValue) {
      const days = differenceInCalendarDays(
        new Date(newValue),
        new Date(value)
      );
      this.$nextTick(() => {
        if (days > 0) {
          this.scrollTo(days * this.colWidth);
        }
      });
    },
  },
  mounted() {
    this.scrollToToday();
  },
  updated() {
    this.$nextTick(() => {
      this.initRowHeight();
    });
  },
  methods: {
    onMouseOverItem(event, item) {
      this.onMouseMoveItem(event);
      this.isOnHover = true;
      this.hoveringItem = item;
    },
    onMouseMoveItem(event) {
      const tooltip = this.$refs.tooltip;
      tooltip.style.left = `${event.clientX}px`;
      tooltip.style.top = `${event.clientY + 20}px`;
    },
    onMouseOutItem() {
      this.isOnHover = false;
    },
    getItemStyles(item) {
      let left = 1;
      let right = this.dates.length + 1;
      this.dates.forEach((date) => {
        if (
          item[this.startDateField] &&
          differenceInCalendarDays(new Date(item[this.startDateField]), date) >
            0
        ) {
          left++;
        }
        if (
          item[this.endDateField] &&
          differenceInCalendarDays(new Date(item[this.endDateField]), date) < 0
        ) {
          right--;
        }
      });

      const conditionStyle = this.matchedConditions(item);

      return [
        `grid-column-start: ${left}`,
        `grid-column-end: ${right}`,
        `color: ${conditionStyle?.color || "inherit"}`,
        `background: ${conditionStyle?.background || "var(--purple-25)"}`,
      ];
    },
    scrollToToday() {
      const grid = this.$refs.grid;
      const todayColumn = grid.querySelector(".column.today");
      if (todayColumn) {
        const grid = this.$refs.grid;
        this.scrollTo(
          todayColumn.offsetLeft - Math.round(grid.offsetWidth / 2)
        );
      }
    },
    initRowHeight() {
      const layout = document.getElementById("timeline-layout");
      const grid = layout.querySelector(".grid");
      const sidebar = layout.querySelector(".grid-sidebar");
      if (!sidebar) return;

      const rows = layout.getElementsByClassName("row-grid");
      const groups = layout.getElementsByClassName("group");
      for (var i = 0; i < rows.length; i++) {
        groups[i].style.height = rows[i].offsetHeight + "px";
      }
      grid.addEventListener("scroll", () => {
        const top = grid.scrollTop * -1;
        sidebar.style.top = top + "px";
      });
    },
    scrollTo(left) {
      const grid = this.$refs.grid;
      grid.scrollLeft = left;
    },
    avatarSrc(user: any): string | null {
      if (user === null) return null;

      if (user?.avatar?.id) {
        return this.addTokenToURL(
          `${getRootPath()}assets/${user.avatar.id}?key=system-medium-cover`
        );
      }

      return null;
    },

    getToken(): string | null {
      return (
        this.api.defaults.headers.common["Authorization"]?.split(" ")[1] || null
      );
    },
    addTokenToURL(url: string, token?: string): string {
      const accessToken = token || this.getToken();
      if (!accessToken) return url;
      return addQueryToPath(url, { access_token: accessToken });
    },
    matchedConditions(item) {
      return (this.conditionalStyles || []).find(
        ({ field, operator, value }) => {
          const left = String(item[field] || "");
          const right = String(value);
          switch (operator) {
            case "eq":
              return left === right;
            case "neq":
              return left !== right;
            case "contains":
              return left.includes(right);
            case "starts_with":
              return left.startsWith(right);
            case "ends_with":
              return left.endsWith(right);
          }
        }
      );
    },
  },
});
</script>

<style scoped>
#timeline-layout {
  position: relative;
  height: calc(100vh - 180px);
  overflow: hidden;
}
.grid {
  position: relative;
  overflow: auto;
  width: 100%;
  height: calc(100vh - 180px);
  /* z-index: 1; */
}
.grid-sidebar {
  position: absolute;
  left: 0;
  display: inline;
  min-height: calc(100vh - 180px);
  max-width: 200px;
  z-index: 4;
  top: 0;
  margin-top: 66px;
  background: rgb(255 255 255 / 85%);
}
.grid-sidebar .group {
  margin-top: 20px;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  padding: 8px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: auto;
}

.relative {
  position: relative;
}
.grid .column {
  position: absolute;
  z-index: 1;
  top: 0;
  border-right: 1px solid #f3f3f3;
  min-height: calc(100vh - 180px);
  padding-top: 40px;
}
.grid-header {
  display: flex;
  z-index: 5;
  background: white;
  border-bottom: 1px solid #f3f3f3;
  padding: 8px 0px;
  position: sticky;
  top: 0;
}
.grid-header .cell {
  border-right: 1px solid #dedede;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: auto;
}
.grid-body {
  flex-grow: 1;
  position: relative;
  z-index: 2;
}
.grid-body .row {
  display: flex;
  margin-top: 20px;
  background: rgb(0 0 0 / 4%);
  min-height: 100px;
  /* position: relative; */
}
.grid-body .row-group {
  flex-shrink: 0;
  word-break: break-all;
  align-self: center;
  padding: 10px;
  position: absolute;
  left: 0;
}
.grid-body .row-grid {
  display: grid;
  /* z-index: 3; */
  width: 100%;
  grid-row-gap: 12px;
  padding: 16px 0px;
  /* grid-template-columns: 80px; */
}
.clickable {
  cursor: pointer;
}
.item {
  display: flex;
  align-items: center;
  /* z-index: 3; */
  margin: 0px 2px 0px 1px;
  background-color: var(--purple-25);
  height: 28px;
  box-sizing: border-box;
  padding: 2px 4px;
  border-radius: 20px;
}
.item .title {
  /* flex-grow: 1; */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  padding-left: 4px;
  /* position: sticky;
	left: 0;
	width: fit-content; */
}
.avatar {
  flex-shrink: 0;
  border-radius: 100%;
}
.weekend {
  background: #fafafa;
}
.today {
  background: var(--blue-25);
}
small {
  font-size: 12px;
}
.text-gray {
  color: var(--v-notice-color);
}
.item-toolip {
  position: fixed;
  max-width: 400px;
  min-width: 280px;
  left: 50px;
  top: 50px;
  /* z-index: 5; */
  background: white;
  border: 1px solid #fafafa;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 4px lightgray;
}
.mb-5 {
  margin-bottom: 5px;
}
.mb-10 {
  margin-bottom: 10px;
}
.mr-5 {
  margin-right: 5px;
}
.t12 {
  font-size: 12px;
}
.d-flex {
  display: flex;
}
</style>
