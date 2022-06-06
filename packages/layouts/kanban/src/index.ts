import { defineLayout } from '@directus/extensions-sdk';
import KanbanComponent from './kanban.vue';
import KanbanOptions from './options.vue';
import { ref, computed, watch, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { useSync, useCollection, useItems } from '@directus/shared/composables';
import { LayoutOptions, LayoutQuery } from './types';
import { syncRefProperty } from './utils/sync-ref-property';
import { Field } from '@directus/shared/types';
import { getFieldsFromTemplate } from '@directus/shared/utils';

export default defineLayout<LayoutOptions, LayoutQuery>({
	id: 'kanban',
	name: 'Kanban',
	icon: 'view_kanban',
	component: KanbanComponent,
	slots: {
		options: KanbanOptions,
		sidebar: () => undefined,
		actions: () => undefined,
	},
	setup(props, { emit }) {
		const name = ref('Kanban Layout');

		const router = useRouter();
		const layoutOptions = useSync(props, 'layoutOptions', emit);
		const layoutQuery = useSync(props, 'layoutQuery', emit);

		const { collection, filter, filterUser, search } = toRefs(props);

		const { info, primaryKeyField, fields: fieldsInCollection } = useCollection(collection);

		const { sort, limit, page, fields } = useItemOptions();

		const groupBy = syncRefProperty(layoutOptions, 'groupBy', undefined);
		const groupTitle = syncRefProperty(layoutOptions, 'groupTitle', undefined);
		const cardTitle = syncRefProperty(layoutOptions, 'cardTitle', undefined);
		const cardSubtitle = syncRefProperty(layoutOptions, 'cardSubtitle', undefined);

		const cardTags = syncRefProperty(layoutOptions, 'cardTags', undefined);
		const cardDate = syncRefProperty(layoutOptions, 'cardDate', undefined);
		const cardImage = syncRefProperty(layoutOptions, 'cardImage', undefined);
		const cardImageFit = syncRefProperty(layoutOptions, 'cardImageFit', undefined);
		const cardUser = syncRefProperty(layoutOptions, 'cardUser', undefined);
		const showUngrouped = syncRefProperty(layoutOptions, 'showUngrouped', undefined);

		const collectionFields = computed(() => {
			return fieldsInCollection.value;
		});

		const groupByFields = computed(() => {
			return (collectionFields.value as Field[]).filter(
				({ meta }) => meta?.interface == 'select-dropdown' || meta?.interface == 'select-radio'
			);
		});

		const groupTitleFields = computed(() => {
			const selectedGroupByField = (collectionFields.value as Field[]).find(({ field }) => field == groupBy.value);

			if (selectedGroupByField?.schema?.foreign_key_table) {
				const { fields: fieldsInGroupBy } = useCollection(selectedGroupByField.schema.foreign_key_table);
				return (fieldsInGroupBy.value as Field[]).filter(({ type }) => type == 'string');
			} else {
				return [];
			}
		});

		const cardTitleFields = computed(() => {
			return (collectionFields.value as Field[]).filter(({ type }) => type == 'string');
		});

		const cardSubtitleFields = computed(() => {
			return (collectionFields.value as Field[]).filter(({ type }) => ['string', 'text'].includes(type));
		});

		const cardTagsFields = computed(() => {
			return (collectionFields.value as Field[]).filter(({ meta }) => meta?.interface == 'tags');
		});

		const cardDateFields = computed(() => {
			return (collectionFields.value as Field[]).filter(({ schema }) =>
				['dateTime', 'date', 'time', 'timestamp'].includes(schema?.data_type || '')
			);
		});

		const cardImageFields = computed(() => {
			return (collectionFields.value as Field[]).filter(
				({ meta, schema }) => meta?.interface == 'file-image' && schema?.foreign_key_table == 'directus_files'
			);
		});

		const cardUserFields = computed(() => {
			return (collectionFields.value as Field[]).filter(
				({ meta, schema }) => meta?.interface == 'select-dropdown-m2o' && schema?.foreign_key_table == 'directus_users'
			);
		});

		const { items, loading, error, totalPages, itemCount, totalCount, getItems } = useItems(collection, {
			sort,
			limit,
			page,
			fields,
			filter,
			search,
		});

		return {
			name,
			collectionFields,
			groupBy,
			groupByFields,
			groupTitle,
			groupTitleFields,
			cardTitle,
			cardTitleFields,
			cardSubtitle,
			cardSubtitleFields,
			cardTags,
			cardTagsFields,
			cardDate,
			cardDateFields,
			cardImage,
			cardImageFields,
			cardImageFit,
			cardUser,
			cardUserFields,
			showUngrouped,
			items,
			loading,
			error,
			totalPages,
			itemCount,
			totalCount,
			getItems,
			resetPresetAndRefresh,
		};

		async function resetPresetAndRefresh() {
			await props?.resetPreset?.();
			refresh();
		}

		function refresh() {
			getItems();
		}

		function useItemOptions() {
			const page = syncRefProperty(layoutQuery, 'page', 1);
			const limit = syncRefProperty(layoutQuery, 'limit', -1);
			const defaultSort = computed(() => (primaryKeyField.value ? [primaryKeyField.value?.field] : []));
			const sort = syncRefProperty(layoutQuery, 'sort', defaultSort);
			const fieldsDefaultValue = computed(() => {
				let customFieldsDefaultValue: Array<string> = [];
				collectionFields.value.forEach(({ field, schema, meta }: Field) => {
					if (schema?.foreign_key_table == 'directus_files' && meta?.interface == 'file-image') {
						['id', 'filename_disk', 'modified_on', 'storage', 'type'].forEach((subField: string) =>
							customFieldsDefaultValue.push(`${field}.${subField}`)
						);
					}

					if (schema?.foreign_key_table == 'directus_users') {
						[
							'id',
							'first_name',
							'last_name',
							'avatar.id',
							'avatar.storage',
							'avatar.filename_disk',
							'avatar.type',
							'avatar.modified_on',
						].forEach((subField: string) => customFieldsDefaultValue.push(`${field}.${subField}`));
					}

					customFieldsDefaultValue.push(field);
				});

				const titleSubtitleFields: string[] = [];
				if (cardTitle.value) {
					titleSubtitleFields.push(...getFieldsFromTemplate(cardTitle.value));
				}
				if (cardSubtitle.value) {
					titleSubtitleFields.push(...getFieldsFromTemplate(cardSubtitle.value));
				}

				return [...customFieldsDefaultValue, ...titleSubtitleFields].sort();
			});

			const fields = syncRefProperty(layoutQuery, 'fields', fieldsDefaultValue);

			return { sort, limit, page, fields };
		}
	},
});
