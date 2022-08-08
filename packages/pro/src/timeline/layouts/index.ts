import { useCollection } from '@directus/shared/composables';
import { useItems } from '@directus/shared/composables';
import { Field } from '@directus/shared/types';
import { defineLayout } from '@directus/shared/utils';
import { computed, ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import TimelineActions from './actions.vue';
import TimelineLayout from './layout-timeline.vue';
import TimelineOptions from './options.vue';
import { useSync } from '@directus/shared/composables';
import { LayoutOptions } from './types';
import { syncRefProperty } from './utils/functions';
import startOfYear from 'date-fns/startOfYear';
import endOfYear from 'date-fns/endOfYear';

export default defineLayout<LayoutOptions>({
	id: 'timeline',
	name: 'Timeline',
	icon: 'view_timeline',
	component: TimelineLayout,
	slots: {
		options: TimelineOptions,
		sidebar: () => undefined,
		actions: TimelineActions,
	},
	setup(props, { emit }) {
		const { t } = useI18n();

		const layoutOptions = useSync(props, 'layoutOptions', emit);

		const { collection, filter, search } = toRefs(props);

		const { primaryKeyField, fields: fieldsInCollection } = useCollection(collection);

		const dateFields = computed(() =>
			fieldsInCollection.value.filter((field: Field) => {
				return ['timestamp', 'dateTime', 'date'].includes(field.type);
			})
		);

		const stringFields = computed(() =>
			fieldsInCollection.value.filter((field: Field) => {
				return ['string', 'text'].includes(field.type) && !field?.schema?.foreign_key_table;
			})
		);

		const userFields = computed(() =>
			fieldsInCollection.value.filter((field: Field) => {
				return field?.schema?.foreign_key_table === 'directus_users';
			})
		);

		const tagFields = computed(() =>
			fieldsInCollection.value.filter((field: Field) => {
				return field?.meta?.interface === 'tags';
			})
		);

		const startDateField = syncRefProperty(layoutOptions, 'startDateField', undefined);
		const endDateField = syncRefProperty(layoutOptions, 'endDateField', undefined);
		const groupField = syncRefProperty(layoutOptions, 'groupField', undefined);
		const titleField = syncRefProperty(layoutOptions, 'titleField', undefined);
		const userField = syncRefProperty(layoutOptions, 'userField', undefined);
		const tagField = syncRefProperty(layoutOptions, 'tagField', undefined);
		const conditionalStyles = syncRefProperty(layoutOptions, 'conditionalStyles', []);
		const viewInfo = syncRefProperty(layoutOptions, 'viewInfo', {
			type: 'month',
			startDate: startOfYear(new Date()),
			endDate: endOfYear(new Date()),
			zoom: 1,
		});

		const { items, loading, error, totalPages, itemCount, totalCount, changeManualSort, getItems } = useItems(
			collection,
			{
				sort: computed(() => [primaryKeyField.value?.field || '']),
				page: ref(1),
				limit: ref(-1),
				fields: computed(() => {
					if (!primaryKeyField.value) return [];

					const fields = [primaryKeyField.value.field];

					if (startDateField.value) fields.push(startDateField.value);
					if (endDateField.value) fields.push(endDateField.value);
					if (groupField.value) fields.push(groupField.value);
					if (titleField.value) fields.push(titleField.value);
					if (tagField.value) fields.push(tagField.value);
					if (userField.value) {
						fields.push(userField.value + '.first_name');
						fields.push(userField.value + '.last_name');
						fields.push(userField.value + '.email');
						fields.push(userField.value + '.avatar.id');
					}
					return fields;
				}),
				filter: filter,
				search: search,
			}
		);

		const showingCount = computed(() => {
			if (!itemCount.value) return null;

			return t('item_count', itemCount.value);
		});

		return {
			items,
			loading,
			error,
			totalPages,
			itemCount,
			totalCount,
			changeManualSort,
			getItems,
			dateFields,
			stringFields,
			userFields,
			tagFields,
			startDateField,
			endDateField,
			groupField,
			titleField,
			userField,
			tagField,
			conditionalStyles,
			viewInfo,
			showingCount,
			layoutOptions,
		};
	},
});
