<template>
	<private-view :title="`${formatTitle(collection?.name)}`">
		<template #headline>
			<v-breadcrumb :items="[{ name: 'Import Data', to: '/import' }]" />
		</template>

		<template #title-outer:prepend>
			<v-button class="header-icon" rounded icon secondary exact to="/import">
				<v-icon name="arrow_back" />
			</v-button>
		</template>

		<template #navigation>
			<navigation></navigation>
		</template>

		<template #sidebar>
			<sidebar-detail icon="info" :title="t('information')" close></sidebar-detail>
		</template>

		<div v-if="collection" class="padding-box">
			<form id="form-import" style="display: flex; align-items: center">
				<div style="flex-grow: 1">
					<component
						:is="'interface-file'"
						v-if="folder"
						ref="inputFile"
						:value="file ? file.id : null"
						:folder="folder.id"
						collection="directus_settings"
						field="project_logo"
						:disabled="isSubmit"
						@input="onUpload"
						@update:model-value="onUpload($event)"
					>
						<template #append></template>
					</component>
				</div>

				<v-button
					v-tooltip="createAllowed ? '' : t('not_allowed')"
					:disabled="!canImport"
					style="margin-left: 20px"
					:loading="isSubmit"
					@click="submit()"
				>
					Import
				</v-button>
			</form>

			<br />

			<template v-if="error">
				<v-error v-if="error" :error="error" />
				<br />
			</template>

			<div v-if="items.length" style="padding: 10px 0; display: flex; align-items: center">
				<span>Mapped fields: {{ fieldMapper.filter((field) => field.field !== null).length }}/{{ fields.length }}</span>
				<span style="margin-left: 1rem">
					<v-checkbox v-model="hideUnmappedField" label="Hide unmapped fields"></v-checkbox>
				</span>
				<div
					style="
						flex-grow: 1;
						display: flex;
						align-items: center;
						justify-content: flex-end;
						color: var(--foreground-subdued);
					"
				>
					<span>{{ itemCount }}</span>
					<span>&nbsp;|&nbsp;</span>
					<span>{{ `Page ${page}/${totalPage}` }}</span>
					<v-button icon secondary size="sm" :disabled="page === 1" style="margin-left: 10px" @click="page = page - 1">
						<v-icon name="keyboard_arrow_left" />
					</v-button>
					<v-button
						icon
						secondary
						size="sm"
						:disabled="page === totalPage"
						style="margin-left: 10px"
						@click="page = page + 1"
					>
						<v-icon name="keyboard_arrow_right" />
					</v-button>
				</div>
			</div>

			<div v-if="items.length" class="v-table table">
				<table style="width: 100%">
					<thead class="table-header">
						<tr>
							<td
								v-for="header in tableFields"
								:key="header"
								:class="[
									fieldMapper.find((field) => field.header === header).field === null ? 'unmapped-field-col' : '',
								]"
							>
								<v-select
									:items="fieldOptions"
									item-value="field"
									item-text="name"
									inline
									:model-value="fieldMapper.find((field) => field.header === header).field"
									@update:model-value="(value) => mapField(value, header)"
								/>
							</td>
						</tr>
						<tr class="original-header-row">
							<td v-for="(field, index) in tableFields" :key="`original-header-${index}`">{{ field }}</td>
						</tr>
					</thead>
					<tbody>
						<template v-for="(item, index) in items" :key="`row-${(index + 1) * page}`">
							<tr class="table-row">
								<td v-for="key in tableFields" :key="key">
									<span v-if="item[key] === null || item[key] === ''" class="null">--</span>
									<span v-else-if="typeof item[key] === 'boolean'">
										<v-icon :name="item[key] ? 'check' : 'close'" :color="item[key] ? '#00C897' : '#B0BEC5'" />
									</span>
									<span v-else-if="Array.isArray(item[key])">
										<v-chip v-for="value in item[key]" :key="value" style="margin: 2px; height: auto !important" small>
											{{ value }}
										</v-chip>
									</span>
									<span v-else>{{ item[key] }}</span>
								</td>
							</tr>
						</template>
					</tbody>
				</table>
			</div>
			<div v-else>Select your CSV file to see preview data.</div>

			<v-dialog v-model="isSucceed" @esc="resetState()">
				<v-card>
					<v-card-title>Import has been scheduled</v-card-title>
					<v-card-text>
						It'll take a few minutes to complete this import. You will be notified by email when it's done.
					</v-card-text>
					<v-card-actions>
						<v-button secondary @click="clearAll()">Close</v-button>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</div>
	</private-view>
</template>

<script>
import { inject, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import * as XLSX from 'xlsx';
import Navigation from '../components/navigation.vue';
import formatTitle from '@directus/format-title';
import { convertData } from '@catex/shared';

export default {
	components: {
		Navigation,
	},
	inject: ['api'],
	setup() {
		const stores = inject('stores');
		const route = useRoute();
		const collectionsStore = stores.useCollectionsStore();
		const fieldsStore = stores.useFieldsStore();
		const userStore = stores.useUserStore();
		const permissionsStore = stores.usePermissionsStore();
		const { t } = useI18n();
		collectionsStore.hydrate();
		const collection = collectionsStore.getCollection(route.params.collection);
		const fields = fieldsStore.getFieldsForCollection(route.params.collection);
		const hideUnmappedField = ref(false);

		return {
			t,
			collection,
			fields,
			formatTitle,
			createAllowed,
			hideUnmappedField,
		};

		function createAllowed() {
			const admin = userStore?.currentUser?.role.admin_access === true;
			if (admin) return true;

			const createPermissions = permissionsStore.permissions.find(
				(permission) => permission.action === 'create' && permission.collection === route.params.collection
			);
			return !!createPermissions;
		}
	},
	data() {
		return {
			file: null,
			folder: null,
			fileData: [],
			isSubmit: false,
			isSucceed: false,
			error: null,
			totalRows: 0,
			maxRows: 10000,
			limit: 50,
			page: 1,
			fileContent: null,
			fieldMapper: [],
		};
	},
	computed: {
		fileHeader() {
			return this.fileData.length ? Object.keys(this.fileData[0]).map((header) => header.trim()) : [];
		},
		fieldOptions() {
			const options = this.fields.map((field) => {
				return {
					field: field.field,
					name: field.name,
					required: field.meta.required,
					disabled: !!this.fieldMapper.find((mappedField) => mappedField.field === field.field),
				};
			});

			options.push({
				field: null,
				name: 'Unmapped field',
				required: false,
				disabled: false,
			});

			return options;
		},
		tableFields() {
			if (this.hideUnmappedField) {
				return this.fieldMapper.filter((field) => field.field !== null).map((field) => field.header);
			}

			return this.fieldMapper.map((field) => field.header);
		},
		pointFields() {
			return this.fields.filter((e) => e.schema?.data_type === 'point');
		},
		payload() {
			let payload = this.fileData.map((e) => e);
			return payload;
		},
		canImport() {
			return !this.error && this.fieldMapper.filter((field) => field.field !== null).length > 0;
		},
		items() {
			const offset = this.limit * (this.page - 1);
			const items = this.payload.filter((e, index) => index >= offset && index < offset + this.limit);

			// Convert
			const convertedItems = items.map((item) => {
				const converted = {};
				for (const [key, value] of Object.entries(item)) {
					const field = this.fieldMapper.find((mappedField) => mappedField.header === key)?.field;
					if (field) {
						const type = this.fields.find((e) => e.field === field)?.type;
						converted[key] = convertData(value, type);
					} else {
						converted[key] = value;
					}
				}
				return converted;
			});

			return convertedItems;
		},
		totalPage() {
			return Math.ceil(this.payload.length / this.limit);
		},
		textFormatTypes() {
			return ['code', 'textarea', 'wysiyyg', 'markdown'];
		},
		itemCount() {
			const start = (this.page - 1) * this.limit + 1;
			const end = Math.min(this.page * this.limit, this.totalRows || 0);
			const count = this.totalRows || 0;
			return `${start}-${end} of ${count} items`;
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
					this.api.post('/folders', { name: 'Imports' }).then((res) => {
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
			formData.append('collectionName', formatTitle(this.collection.name));
			formData.append('fieldMapper', JSON.stringify(this.fieldMapper));
			this.api
				.post(`/data-management/import/${collection}`, formData)
				.then(() => (this.isSucceed = true))
				.catch((err) => (this.error = err))
				.finally(() => (this.isSubmit = false));
		},
		onUpload(fileId) {
			this.resetState();

			if (!fileId) {
				this.file = null;
				return;
			}

			this.api.get(`/files/${fileId}`).then((res) => {
				this.file = res.data.data;
				const ext = this.file.filename_download.split('.').pop().toLowerCase();

				if (ext !== 'csv') {
					this.error = {
						code: this.file.filename_download,
						message: 'Invalid file type, support only CSV file',
					};
					return;
				}

				this.api.get(`/assets/${this.file.id}`, { responseType: 'arraybuffer' }).then((res) => {
					this.fileContent = res.request.response;
					const data = new Uint8Array(res.request.response);
					const workbook = XLSX.read(data, {
						type: 'array',
						sheetRows: this.maxRows + 1,
						cellDates: true,
						codepage: 65001,
					});
					const worksheet = workbook.Sheets[workbook.SheetNames[0]];
					var range = XLSX.utils.decode_range(worksheet['!ref']);
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
					if (!worksheet['A1']) {
						this.error = {
							code: this.file.filename_download,
							message: 'File data is empty',
						};
						this.resetState();
					}

					// Convert worksheet to array
					this.fileData = XLSX.utils.sheet_to_json(worksheet, {
						defval: '',
						blankRows: false,
					});

					// Auto mapField
					this.fileHeader.forEach((header) => {
						const formattedHeader = header.toLowerCase().replace(/\s/g, '_');
						const field = this.fields.find((e) => e.field === formattedHeader);
						this.fieldMapper.push({ field: field ? field.field : null, header });
					});
				});
			});
		},
		resetState() {
			this.page = 1;
			this.error = null;
			this.isSucceed = false;
			this.fileData = [];
			this.fieldMapper = [];
		},
		clearAll() {
			this.resetState();
			this.file = null;
			document.getElementById('form-import').reset();
		},
		mapField(fieldKey, header) {
			if (!this.fieldMapper.find((field) => field.header === header)) {
				this.fieldMapper.push({ header, field: fieldKey });
				return;
			}

			this.fieldMapper = this.fieldMapper.map((field) => {
				if (field.header === header) {
					field.field = fieldKey;
				}
				return field;
			});
		},
		getCollectionFieldFromFileHeader(header) {
			const { field } = this.fieldMapper.find((field) => field.header === header);
			return this.fields.find((e) => e.field === field);
		},
		getCollectionFieldType(header) {
			const field = this.getCollectionFieldFromFileHeader(header);

			if (field) {
				return field.type;
			}

			return 'string';
		},
	},
};
</script>

<style scoped>
.padding-box {
	padding: var(--content-padding);
	padding-top: 0;
}
input[type='file'] {
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

:deep(.inline-display) {
	position: relative;
}

.original-header-row td {
	color: var(--foreground-subdued);
	font-family: var(--font-monospace);
}

.unmapped-field-col {
	color: var(--danger);
}

.null {
	color: var(--border-normal);
}
</style>
