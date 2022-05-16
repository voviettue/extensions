<template>
  <private-view :title="`Import ${formatTitle(collection?.name)}`">
    <template #headline>
      <v-breadcrumb
        :items="[{ name: 'Import data', to: '/data-management/import' }]"
      />
    </template>

    <template #title-outer:prepend>
      <v-button class="header-icon" rounded disabled icon secondary>
        <v-icon name="file_upload" />
      </v-button>
    </template>

    <template #navigation>
      <navigation></navigation>
    </template>

    <div class="padding-box" v-if="collection">
      <form id="form-import" style="display: flex; align-items: center">
        <div style="flex-grow: 1">
          <component
            v-if="folder"
            ref="inputFile"
            :is="'interface-file'"
            :value="file ? file.id : null"
            :folder="folder.id"
            collection="directus_settings"
            field="project_logo"
            @input="onUpload"
            :disabled="isSubmit"
            @update:model-value="onUpload($event)"
          >
            <template #append></template>
          </component>
        </div>

        <v-button
          :disabled="!canImport"
          @click="submit()"
          v-tooltip="createAllowed ? '' : t('not_allowed')"
          style="margin-left: 20px"
          :loading="isSubmit"
        >
          Import
        </v-button>
        <!-- <v-upload fromLibrary fromUrl @input="onUpload" />
        <v-input type="file" accept=".csv" @input="onChangeFile" /> -->
      </form>

      <br />

      <template v-if="error">
        <v-error v-if="error" :error="error" />
        <br />
      </template>

      <div
        v-if="payload.length"
        style="padding: 10px 0; display: flex; align-items: center"
      >
        <span>Total rows: {{ payload.length }}</span>
        <span>&nbsp;|&nbsp;</span>
        <span
          >Mapped fields: {{ mappedFields.length }}/{{ fields.length }}</span
        >
        <span>&nbsp;|&nbsp;</span>
        <span
          >Page {{ this.page }}/{{
            Math.ceil(this.payload.length / this.limit)
          }}</span
        >
        <div style="flex-grow: 1; text-align: right">
          <v-button
            icon
            secondary
            size="sm"
            :disabled="this.page === 1"
            @click="this.page = this.page - 1"
            style="margin-left: 10px"
            ><v-icon name="keyboard_arrow_left"
          /></v-button>
          <v-button
            icon
            secondary
            size="sm"
            :disabled="this.page === totalPage"
            @click="this.page = this.page + 1"
            style="margin-left: 10px"
            ><v-icon name="keyboard_arrow_right"
          /></v-button>
        </div>
      </div>

      <div class="v-table table">
        <table style="width: 100%">
          <thead class="table-header">
            <tr class="fixed">
              <td
                v-for="field in fields"
                :key="field.field"
                v-tooltip="formatTitle(field.field)"
              >
                {{ field.field }}
              </td>
            </tr>
          </thead>
          <tbody>
            <template
              v-for="(item, index) in items"
              :key="`row-${(index + 1) * this.page}`"
            >
              <tr class="table-row">
                <td
                  class="cell"
                  v-for="field in fields"
                  :key="`item-${index}-${field.field}`"
                >
                  <span v-if="Array.isArray(item[field.field])">
                    <v-chip
                      style="margin: 2px; height: auto !important"
                      v-for="value in item[field.field]"
                      :key="`${field.field}-${value}`"
                      small
                    >
                      {{ value }}
                    </v-chip>
                  </span>
                  <span v-else-if="typeof item[field.field] === 'boolean'">
                    <v-icon
                      :name="item[field.field] ? 'check' : 'close'"
                      :color="item[field.field] ? '#00C897' : '#B0BEC5'"
                    />
                  </span>
                  <template v-else>
                    <pre v-if="textFormatTypes.includes(field.meta.field)">{{
                      item[field.field] || ""
                    }}</pre>
                    <pre v-else-if="typeof item[field.field] === 'object'">{{
                      item[field.field] || ""
                    }}</pre>
                    <span v-else>{{ item[field.field] || "" }}</span>
                  </template>
                </td>
              </tr>
            </template>

            <template v-if="payload.length === 0">
              <tr>
                <td :colspan="fields.length">
                  <div
                    style="color: lightgray; text-align-center; padding:10px"
                  >
                    Select your csv file to see preview data.
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <v-dialog v-model="isSucceed" @esc="resetState()">
        <v-card>
          <v-card-title>{{ formatTitle("import_success") }}</v-card-title>
          <v-card-text>
            Import {{ payload.length }} items succeed.
          </v-card-text>
          <v-card-actions>
            <v-button secondary @click="clearAll()"> Continue Import </v-button>
            <v-button kind="success" :to="`/content/${collectionName}`">
              View data
            </v-button>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </private-view>
</template>

<script>
import { inject } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import XLSX from "xlsx";
import Navigation from "../components/navigation.vue";
import formatTitle from "@directus/format-title";
import { convertArray, convertBoolean, convertJson } from "../utils";

export default {
  components: {
    Navigation,
  },
  inject: ["api"],
  setup() {
    const stores = inject("stores");
    const route = useRoute();
    const collectionsStore = stores.useCollectionsStore();
    const fieldsStore = stores.useFieldsStore();
    const userStore = stores.useUserStore();
    const permissionsStore = stores.usePermissionsStore();
    const { t } = useI18n();
    collectionsStore.hydrate();
    const collection = collectionsStore.getCollection(route.params.collection);
    const fields = fieldsStore.getFieldsForCollection(route.params.collection);

    return {
      t,
      collection,
      fields,
      formatTitle,
      createAllowed,
    };

    function createAllowed() {
      const admin = userStore?.currentUser?.role.admin_access === true;
      if (admin) return true;

      const createPermissions = permissionsStore.permissions.find(
        (permission) =>
          permission.action === "create" &&
          permission.collection === route.params.collection
      );
      return !!createPermissions;
    }
  },
  data() {
    return {
      file: null,
      folder: null,
      fileData: [],
      fileReaderError: false,
      isSubmit: false,
      isSucceed: false,
      error: null,
      totalRows: 0,
      maxRows: 10000,
      limit: 50,
      page: 1,
      fileContent: null,
    };
  },
  computed: {
    collectionName() {
      return this.$route.params.collection;
    },
    mappedFields() {
      return this.payload.length ? Object.keys(this.payload[0]) : [];
    },
    pointFields() {
      return this.fields.filter((e) => e.schema?.data_type === "point");
    },
    payload() {
      let payload = this.fileData.map((e) => e);
      const keys = this.fields.map((e) => e.field);

      return this.convertPayload(payload).map((item) => {
        Object.keys(item).forEach((key) => {
          if (!keys.includes(key)) {
            delete item[key];
          }
        });
        return item;
      });
    },
    canImport() {
      return !this.error && this.mappedFields.length;
    },
    items() {
      const offset = this.limit * (this.page - 1);
      const items = this.payload.filter(
        (e, index) => index >= offset && index < offset + this.limit
      );
      return items;
    },
    totalPage() {
      return Math.ceil(this.payload.length / this.limit);
    },
    textFormatTypes() {
      return ["code", "textarea", "wysiyyg", "markdown"];
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.initFolder();
    },
    initFolder() {
      this.api.get('/folders?name="Imports"').then((res) => {
        const folders = res.data.data;
        if (folders.length) {
          this.folder = folders[0];
        } else {
          this.api.post("/folders", { name: "Imports" }).then((res) => {
            this.folder = res.data.data;
          });
        }
      });
    },
    submit() {
      this.isSubmit = true;
      const collection = this.collection.collection;
      const formData = new FormData();
      formData.append('file', new Blob([this.fileContent], { type: 'text/csv' }));
      this.api
        .post(`/data-management/import/${collection}`, formData)
        .then(res => this.isSucceed = true)
        .catch(err => this.error = err)
        .finally(() => (this.isSubmit = false));
    },
    fetchFields() {
      const collection = collection.collection;
      this.api.get(`/fields/${collection}?limit=-1&sort[]=sort`).then((res) => {
        const editableFields = res.data.data.filter((e) => !e.meta.readonly);
        this.fields = editableFields.sort((a, b) => {
          const left = a.meta.sort || -1;
          const right = b.meta.sort || -1;
          return left - right;
        });
      });
    },
    onUpload(fileId) {
      this.resetState();

      if (!fileId) {
        this.file = null;
        return;
      }

      this.api.get(`/files/${fileId}`).then((res) => {
        this.file = res.data.data;
        const ext = this.file.filename_download.split(".").pop().toLowerCase();

        if (ext !== "csv") {
          this.error = {
            code: this.file.filename_download,
            message: "Invalid file type, support only CSV file",
          };
          return;
        }

        this.api
          .get(`/assets/${this.file.id}`, { responseType: "arraybuffer" })
          .then((res) => {
            this.fileContent = res.request.response
            const data = new Uint8Array(res.request.response);
            const workbook = XLSX.read(data, {
              type: "array",
              sheetRows: this.maxRows + 1,
              cellDates: true,
              codepage: 65001,
            });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            var range = XLSX.utils.decode_range(worksheet["!ref"]);
            this.totalRows = range.e.r;

            // Check max rows limit
            if (this.totalRows > this.maxRows) {
              this.error = {
                code: this.file.filename_download,
                message: `Only import maximum ${this.maxRows} items at once`,
              };
              this.resetState();
            }

            // Check first row empty
            if (!worksheet["A1"]) {
              this.error = {
                code: this.file.filename_download,
                message: "File data is empty",
              };
              this.resetState();
            }

            // Convert worksheet to array
            this.fileData = XLSX.utils.sheet_to_json(worksheet, {
              defval: "",
              blankRows: false,
            });
          });
      });
    },
    resetState() {
      this.page = 1;
      this.error = null;
      this.isSucceed = false;
      this.fileData = [];
    },
    clearAll() {
      this.resetState();
      this.file = null;
      document.getElementById("form-import").reset();
    },
    convertPayload(payload) {
      payload.forEach((item, index) => {
        // handle Point field
        this.pointFields.forEach((pointField) => {
          const name = pointField.field;
          if (item[`${name}.type`] && item[`${name}.coordinates`]) {
            item[name] = {
              type: item[`${name}.type`],
              coordinates: convertJson(item[`${name}.coordinates`]),
            };
          }
        });

        Object.keys(item).forEach((key, index) => {
          const field = this.fields.find((e) => e.field === key);
          if (!field) {
            return;
          }
          if (item[key] === "") {
            item[key] = null;
          }
      
          switch (field.type) {
            case "csv":
            case "alias":
            case "json":
              item[key] = convertJson(item[key]);
              if (!Array.isArray(item[key])) {
                item[key] = convertArray(item[key]);
              }
              break;
            case "boolean":
              item[key] = convertBoolean(item[key]);

            default:
              break;
          }
        });
      });

      return payload;
    },
  },
};
</script>

<style style="scss" scoped>
.padding-box {
  padding: var(--content-padding);
  padding-top: 0;
}
input[type="file"] {
  display: block;
  padding: 10px;
  border: 1px solid lightgray;
  width: 100%;
}
table td,
table th {
  padding: 4px 8px;
  border-bottom: var(--border-width) solid var(--border-subdued);
}
thead tr {
  font-weight: bold;
}
thead td {
  white-space: nowrap;
  overflow: hidden;
}
.v-table {
  overflow: auto;
}

:deep(.v-icon.edit) {
  display: none !important;
}
</style>
