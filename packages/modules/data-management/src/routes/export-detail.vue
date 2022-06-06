<template>
	<private-view :title="`Export ${formatTitle(collection?.name)}`">
		<template #headline>
			<v-breadcrumb :items="[{ name: 'Export data', to: '/data-management/export' }]" />
		</template>

		<template #title-outer:prepend>
			<v-button class="header-icon" rounded disabled icon secondary>
				<v-icon name="file_download" />
			</v-button>
		</template>

		<template #navigation>
			<navigation></navigation>
		</template>

		<div v-if="collection" class="fields padding-box">
			<div>
				<div class="export-label type-label">Export content</div>
				<div style="margin-bottom: 20px">
					<v-select
						:items="bookmarkOptions"
						item-value="id"
						item-text="bookmark"
						:model-value="selectedBookmark"
						:disabled="bookmarkOptions.length == 0"
						@update:model-value="onUpdateBookmark"
					/>
				</div>
				<div class="export-label type-label">Search and filters</div>
				<div style="margin-bottom: 20px">
					<search-input
						v-model="search"
						v-model:filter="filter"
						style="z-index: 1"
						:collection="collection.collection"
					/>
				</div>
				<div class="export-label type-label">Type</div>
				<div style="display: flex; margin-bottom: 20px">
					<v-radio
						v-for="item in fileTypes"
						:key="item.value"
						style="padding-left: 20px"
						:label="item.text"
						:value="item.value"
						:model-value="selectedFileType"
						@update:model-value="onUpdateFileType"
					/>
				</div>
				<div class="export-label type-label">Available fields</div>
				<v-checkbox-tree
					class="export-field-tree"
					:choices="availableFields"
					item-text="name"
					item-value="key"
					value-combining="exclusive"
					:model-value="selectedFields"
					@update:model-value="onUpdateFields"
					@group-toggle="loadFieldRelations($event.value)"
				/>
				<v-button :disabled="!canExport" :loading="isSubmit" @click="submit()">Export</v-button>
			</div>

			<br />

			<template v-if="error">
				<v-error v-if="error" :error="error" />
				<br />
			</template>
		</div>

		<v-dialog v-model="isExportGoogleCompleted">
			<v-card>
				<v-card-title>The requested export completed successfully</v-card-title>
				<v-card-text>
					<div class="field">
						<span class="type-label">File name:</span>
						<span class="type-text">{{ exportResult.name }}</span>
					</div>
				</v-card-text>
				<v-card-actions>
					<v-button secondary :href="exportResult.webViewLink">View</v-button>
					<v-button @click="isExportGoogleCompleted = false">OK</v-button>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</private-view>
</template>

<script>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Navigation from '../components/navigation.vue';
import SearchInput from '../components/search-input.vue';
import formatTitle from '@directus/format-title';
import { useApi, useStores } from '@directus/extensions-sdk';
import { useFieldTree } from '../utils/use-field-tree';
import XLSX from 'xlsx';
import flatten from 'flat';
import { getDateFormatted } from '../utils';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SCOPE } from '../config.ts';

export default {
	components: {
		Navigation,
		SearchInput,
	},
	inject: ['api'],
	setup() {
		const { t } = useI18n();

		const api = useApi();
		const { useCollectionsStore, usePresetsStore } = useStores();
		const route = useRoute();

		const collectionsStore = useCollectionsStore();
		const presetStore = usePresetsStore();
		const collection = collectionsStore.getCollection(route.params.collection);
		const preset = presetStore.getPresetForCollection(collection.collection);

		const selectedBookmark = ref(null);
		const search = ref(preset.search);
		const filter = ref(preset.filter);
		const availableFields = ref([]);
		const selectedFields = ref([]);
		const selectedFileType = ref('xlsx');
		const isExportGoogleCompleted = ref(false);

		const { treeList, loadFieldRelations } = useFieldTree(ref(collection.collection));
		availableFields.value = treeList.value;
		selectedFields.value = availableFields.value.map((field) => field.key);

		const fileTypes = computed(() => {
			const types = [
				{ value: 'xlsx', text: 'Excel' },
				{ value: 'csv', text: 'CSV' },
				{ value: 'json', text: 'JSON' },
			];

			if (GOOGLE_CLIENT_ID) {
				types.push({ value: 'google-sheet', text: 'Google Sheet' });
			}

			return types;
		});

		const bookmarkOptions = presetStore.bookmarks.filter((el) => el.collection == collection.collection);
		bookmarkOptions.unshift({ id: null, bookmark: collection.name });

		const isSubmit = ref(false);
		const error = ref(null);
		const canExport = computed(() => {
			return selectedFields.value.length !== 0 && !isSubmit.value;
		});

		const pickerApiLoaded = ref(false);
		const oAuthToken = ref(null);
		const folderId = ref(null);
		const isSelectedUploadGoogleSheet = ref(false);
		const exportResult = ref(null);

		return {
			availableFields,
			loadFieldRelations,
			t,
			collection,
			formatTitle,
			onUpdateFields,
			onUpdateFileType,
			selectedFields,
			fileTypes,
			selectedFileType,
			submit,
			canExport,
			isSubmit,
			error,
			search,
			filter,
			bookmarkOptions,
			selectedBookmark,
			onUpdateBookmark,
			isExportGoogleCompleted,
			exportResult,
		};

		function onUpdateBookmark(newValue) {
			selectedBookmark.value = newValue;

			const bookmark = bookmarkOptions.find((el) => el.id == newValue);
			if (bookmark) {
				search.value = bookmark.search;
				filter.value = bookmark.filter;
				availableFields.value = bookmark.id
					? treeList.value.filter((field) => bookmark.layout_query?.tabular?.fields.includes(field.field))
					: treeList.value;
				selectedFields.value = availableFields.value.map((field) => field.key);
			}
		}

		function onUpdateFields(newValue) {
			selectedFields.value = newValue;
		}

		function onUpdateFileType(newValue) {
			selectedFileType.value = newValue;
			isSelectedUploadGoogleSheet.value = newValue === 'google-sheet';
		}

		function submit() {
			isSubmit.value = true;
			error.value = null;

			return selectedFileType.value === 'google-sheet' ? exportGoogleSheet() : exportFile();
		}

		function exportFile() {
			const collectionName = collection.collection;
			const fileType = selectedFileType.value == 'xlsx' ? 'json' : selectedFileType.value;
			const fileExtension = selectedFileType.value;
			const fileName = `${collectionName} ${getDateFormatted()}.${fileExtension}`;

			let query = `/items/${collectionName}?limit=-1&export=${fileType}`;

			if (selectedFields.value.length > 0) {
				query += `&fields=${selectedFields.value.join(',')}`;
			}

			if (search.value) {
				query += `&search=${search.value}`;
			}

			if (filter.value) {
				query += `&filter=${JSON.stringify(filter.value)}`;
			}

			return api
				.get(query)
				.then((res) => {
					if (fileExtension == 'xlsx') {
						downloadExcelFile(res.data, fileName);
					} else {
						downloadFile(fileType == 'json' ? JSON.stringify(res.data) : res.data, fileName);
					}
				})
				.catch((err) => (error.value = err))
				.finally(() => (isSubmit.value = false));
		}

		function downloadFile(arrayBuffer, filename) {
			const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });

			const link = document.createElement('a');
			link.download = filename;
			link.href = URL.createObjectURL(blob);
			link.click();

			URL.revokeObjectURL(blob);
		}

		function downloadExcelFile(jsonData, fileName) {
			let flatJson = jsonData.map((el) => flatten(el));
			let ws = XLSX.utils.json_to_sheet(flatJson);
			let wb = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(wb, ws, 'data');
			return XLSX.writeFile(wb, fileName);
		}

		async function exportGoogleSheet() {
			await gapi.load('auth2', () => {
				console.log('Auth2 Loaded');
				if (oAuthToken.value) return;

				gapi.auth2.authorize(
					{
						client_id: GOOGLE_CLIENT_ID,
						scope: GOOGLE_CLIENT_SCOPE,
						immediate: false,
					},
					handleAuthResult
				);
			});

			gapi.load('picker', () => {
				console.log('Picker Loaded');
				pickerApiLoaded.value = true;
				createPicker();
			});
		}

		function handleAuthResult(authResult) {
			console.log('Handle Auth result');
			if (authResult && !authResult.error) {
				oAuthToken.value = authResult.access_token;
				createPicker();
			} else {
				isSubmit.value = false;
			}
		}

		function createPicker() {
			console.log('Create Picker');
			if (pickerApiLoaded.value && oAuthToken.value) {
				var docsView = new google.picker.DocsView()
					.setMimeTypes('application/vnd.google-apps.folder')
					.setParent('root')
					.setOwnedByMe(true)
					.setEnableDrives(true)
					.setSelectFolderEnabled(true);
				var picker = new google.picker.PickerBuilder()
					.addView(docsView)
					.setSelectableMimeTypes('application/vnd.google-apps.folder')
					.setCallback(pickerCallback)
					.setOAuthToken(oAuthToken.value)
					.build();
				picker.setVisible(true);
			}
		}

		function pickerCallback(data) {
			console.log('Picker callback');
			if (data.action == google.picker.Action.PICKED) {
				folderId.value = data.docs[0].id;
				fetchCollectionData();
			} else {
				pickerApiLoaded.value = false;
				isSubmit.value = false;
			}
		}

		function fetchCollectionData() {
			isSubmit.value = true;
			const collectionName = collection.collection;
			const fileType = 'json';

			let query = `/items/${collectionName}?limit=-1&export=${fileType}`;

			if (selectedFields.value.length > 0) {
				query += `&fields=${selectedFields.value.join(',')}`;
			}

			if (search.value) {
				query += `&search=${search.value}`;
			}

			if (filter.value) {
				query += `&filter=${JSON.stringify(filter.value)}`;
			}

			return api
				.get(query)
				.then((res) => {
					let jsonData = res.data;
					let flatJson = jsonData.map((el) => flatten(el));
					let ws = XLSX.utils.json_to_sheet(flatJson);
					let wb = XLSX.utils.book_new();
					XLSX.utils.book_append_sheet(wb, ws, 'data');

					return uploadGoogleDriveFile(XLSX.write(wb, { type: 'array', bookType: 'xlsx' }));
				})
				.catch((err) => (error.value = err));
		}

		function uploadGoogleDriveFile(fileContent) {
			var file = new Blob([fileContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

			var metadata = {
				name: `${collection.collection} ${getDateFormatted()}`,
				mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				parents: [folderId.value],
			};

			var accessToken = oAuthToken.value;
			var form = new FormData();
			form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
			form.append('file', file);

			fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
				method: 'POST',
				headers: new Headers({ Authorization: 'Bearer ' + accessToken }),
				body: form,
			})
				.then((res) => {
					return res.json();
				})
				.then(function (val) {
					if (val.error) {
						error.value = val.error;
					} else {
						exportResult.value = val;
						isExportGoogleCompleted.value = true;
					}
				})
				.finally(() => {
					oAuthToken.value = null;
					isSubmit.value = false;
				});
		}
	},
	mounted() {
		let gDrive = document.createElement('script');
		gDrive.setAttribute('type', 'text/javascript');
		gDrive.setAttribute('src', 'https://apis.google.com/js/api.js');
		document.head.appendChild(gDrive);
	},
};
</script>

<style style="scss" scoped>
.fields {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 12px;
}

.padding-box {
	padding: var(--content-padding);
	padding-top: 0;
}

.export-label {
	position: relative;
	display: flex;
	width: max-content;
	margin-bottom: 8px;
	cursor: pointer;
}
.export-field-tree {
	border: var(--border-width) solid var(--border-normal);
	border-radius: var(--border-radius);
	margin-bottom: 20px;
}
</style>
