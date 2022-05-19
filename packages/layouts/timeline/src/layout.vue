<template>
  <div class="wrap-layout">
    <div class="layout-option">
      <span>
        {{ formatDate(new Date(viewInfo.startDate), "dd MMM, yyyy") }} -
        {{ formatDate(new Date(viewInfo.endDate), "dd MMM, yyyy") }}
      </span>
      <div style="margin-left: auto; margin-right: 20px">
        <button
          v-for="viewOption in viewOptions"
          :key="viewOption"
          class="btn-mode"
          :class="{ active: viewOption === viewInfoEditable.type }"
          @click="onUpdateView(viewOption)"
        >
          {{ viewOption }}
        </button>
      </div>
      <div>
        <v-button class="mr-2" secondary small icon @click="zoomOut">
          <v-icon name="zoom_out" style="color: #949494"></v-icon>
        </v-button>

        <v-button secondary small icon @click="zoomIn">
          <v-icon name="zoom_in" style="color: #949494"></v-icon>
        </v-button>
      </div>
    </div>

    <!-- <div id="timeline-layout"> -->
    <timeline-chart
      v-if="viewInfo?.startDate && viewInfo?.endDate"
      :collection="collection"
      :layout-options="layoutOptions"
      :start-date="viewInfo?.startDate"
      :end-date="viewInfo?.endDate"
      :view-mode="viewInfo?.type"
      :zoom="viewInfo?.zoom"
      :items="items"
      :conditional-styles="layoutOptions?.conditionalStyles"
    ></timeline-chart>
    <!-- </div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, onMounted } from "vue";
import { Item } from "@directus/shared/types";
import { useSync } from "@directus/shared/composables";
import TimelineChart from "./components/timeline-chart.vue";
import format from "date-fns/format";
import startOfYear from "date-fns/startOfYear";
import endOfYear from "date-fns/endOfYear";
import subYears from "date-fns/subYears";
import addYears from "date-fns/addYears";

export default defineComponent({
  components: { TimelineChart },
  inheritAttrs: false,
  props: {
    items: {
      type: Array as PropType<Item[]>,
      required: true,
    },
    layoutOptions: {
      type: Object,
      required: true,
    },
    startDateField: {
      type: String,
      default: null,
    },
    endDateField: {
      type: String,
      default: null,
    },
    viewInfo: {
      type: Object,
      required: true,
    },
    collection: {
      type: String,
      required: true,
    },
  },
  emits: ["update:selection", "update:viewInfo"],
  setup(props, { emit }) {
    const viewInfoEditable = useSync(props, "viewInfo", emit);
    const viewOptions = ["day", "week", "month"];
    const formatDate = format;

    if (!viewInfoEditable.value) {
      onUpdateView("day");
    }

    onMounted(() =>
      setTimeout(() => {
        enableExpandRangeTime();
      }, 1000)
    );

    return {
      viewInfoEditable,
      viewOptions,
      formatDate,
      onUpdateView,
      zoomIn,
      zoomOut,
    };

    function onUpdateView($event) {
      viewInfoEditable.value = {
        type: $event,
        startDate: startOfYear(new Date()).toDateString(),
        endDate: endOfYear(new Date()).toDateString(),
        zoom: 1,
      };
    }

    function zoomIn() {
      let zoom = viewInfoEditable.value.zoom + 0.2;
      viewInfoEditable.value = { ...viewInfoEditable.value, zoom: zoom };
    }

    function zoomOut() {
      let zoom = viewInfoEditable.value.zoom - 0.2;
      viewInfoEditable.value = {
        ...viewInfoEditable.value,
        zoom: zoom >= 0.5 ? zoom : 0.4,
      };
    }

    function enableExpandRangeTime() {
      const layout = document.getElementById("timeline-layout");
      const grid = layout.querySelector(".grid");
      let appending = false;
      grid.addEventListener("scroll", () => {
        if (appending) {
          return;
        }
        //left;
        if (grid.scrollLeft === 0) {
          appending = true;
          viewInfoEditable.value.startDate = subYears(
            new Date(viewInfoEditable.value.startDate),
            1
          ).toDateString();
          setTimeout(() => {
            appending = false;
          }, 1000);
        }
        // right
        if (grid.scrollLeft + grid.offsetWidth >= grid.scrollWidth) {
          appending = true;
          viewInfoEditable.value.endDate = addYears(
            new Date(viewInfoEditable.value.endDate),
            1
          ).toDateString();
          setTimeout(() => {
            appending = false;
          }, 1000);
        }
      });
    }
  },
});
</script>

<style scoped>
.wrap-layout {
  padding: 0px var(--content-padding);
}
.layout-option {
  display: flex;
  align-items: center;
  margin-bottom: 0px;
  padding: 8px 0px;
  border-top: 1px solid #f0f4f9;
  border-bottom: 1px solid #f0f4f9;
}
.mr-2 {
  margin-right: 8px;
}
.btn-mode {
  color: #a2b5cd;
  padding: 6px 10px;
  margin-left: 10px;
}
.btn-mode:hover {
  color: #4f5464;
}
.btn-mode.active {
  color: var(--purple);
  font-weight: 600;
}
</style>
