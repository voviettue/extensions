<template>
	<div class="interface">
		<v-notice v-if="!relationInfo" type="warning">
			{{ `Invalid interface options.` }}
		</v-notice>
		<v-table
			v-else
			:key="`items-${items.length}`"
			v-model:headers="headers"
			collection="classes"
			show-resize
			fixed-header
			must-sort
			:items="items"
			:limit="1"
		>
			<template v-for="header in headers" :key="header.value" #[`item.${header.value}`]="{ item }">
				<render-display
					:value="getWithArray(item, header.value)"
					:display="header.field?.meta?.display || 'raw'"
					:options="header.field?.meta?.display_options"
					:interface="header.field?.meta?.interface"
					:interface-options="header.field?.meta?.options"
					:type="header.field.type"
					:collection="header.field.collection"
					:field="header.value"
				/>
			</template>

			<!-- <template #header-context-menu></template> -->
		</v-table>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, inject, watch, ref } from 'vue';
import { Filter, Item } from '@directus/shared/types';
import { getEndpoint } from '@directus/shared/utils';
import get from 'lodash/get';
import set from 'lodash/set';
import has from 'lodash/has';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import useAliasFields from './composables/use-alias-fields';
import { get as getWithArray } from './utils/get-with-arrays';
import { useApi, useStores } from '@directus/extensions-sdk';
import { RelationM2M } from './composables/use-relation-m2m';
import { RelationO2M } from './composables/use-relation-o2m';
import { useRelation } from './composables/use-relation';
import { getFields } from './composables/use-filter';
import { filterItems } from './composables/filter-items';

export default defineComponent({
	props: {
		value: {
			type: String,
			default: null,
		},
		collection: {
			type: String,
			required: true,
		},
		lookupField: {
			type: String,
			required: true,
		},
		viewFields: {
			type: Array,
			default: () => [],
		},
		filter: {
			type: Object as PropType<Filter>,
			default: () => null,
		},
	},
	setup(props) {
		const values: any = inject('values');
		const stores = useStores();
		const { useFieldsStore } = stores;
		const api = useApi();
		const fieldsStore = useFieldsStore();
		const primaryField = fieldsStore.getPrimaryKeyFieldForCollection(props.collection);
		const relationInfo: RelationM2M | RelationO2M | undefined = useRelation(
			props.collection,
			props.lookupField,
			stores
		);
		const primaryKeyField = relationInfo?.relatedPrimaryKeyField;
		const viewFields = props.viewFields ?? [primaryKeyField?.field];
		const watchFieldName = props.lookupField ? props.lookupField.split('.').shift() : primaryField?.field;
		const items = ref([]);

		const headers = ref(getHeaders());

		const filterKeyFields = getFields(props.filter);

		if (relationInfo) {
			let oldValue = cloneDeep(values.value?.[watchFieldName]);
			if (oldValue) {
				getItems();
			}

			// eslint-disable-next-line vue/no-watch-after-await
			watch(
				() => values.value?.[watchFieldName],
				() => {
					if (isEqual(oldValue, values.value?.[watchFieldName])) return;
					oldValue = cloneDeep(values.value?.[watchFieldName]);
					getItems();
				}
			);
		}

		return { relationInfo, headers, items, getWithArray, useAliasFields };

		function getHeaders() {
			return viewFields.map((fieldName: any) => {
				const field = fieldsStore.getField(relationInfo?.relatedCollection?.collection, fieldName ?? '');
				return {
					align: 'left',
					description: null,
					field: field,
					sortable: true,
					text: field?.name,
					value: fieldName,
					width: 200,
				};
			});
		}

		async function getItems() {
			if (!relationInfo) return null;

			const collection = relationInfo.relatedCollection.collection;
			const keys = props.lookupField.split('.');
			keys.pop();
			const path = keys.join('.') || primaryField?.field;
			const primaryKeyField = fieldsStore.getPrimaryKeyFieldForCollection(collection);
			const value = get(values.value, path ?? primaryKeyField?.field);
			const id = value instanceof Object ? value?.[primaryField?.field] : value;

			if (!id) {
				items.value = [];
				await getModifiedData();
				return;
			}

			const fields = viewFields ?? [primaryKeyField.field];
			const filter = props.filter ? cloneDeep(props.filter) : { _and: [] };

			if (relationInfo.type === 'm2m') {
				const reverseRelation = `$FOLLOW(${relationInfo.junctionField.collection},${relationInfo.junctionField.field})`;
				filter['_and'].push({
					[reverseRelation]: {
						_some: {
							[relationInfo.junction.field]: { _eq: id },
						},
					},
				});
			}

			if (relationInfo.type === 'o2m') {
				filter['_and'].push({ [`${relationInfo.relation.field}`]: id });
			}

			api
				.get(getEndpoint(collection), {
					params: { fields, filter },
				})
				.then(async (res) => {
					items.value = res?.data?.data ?? [];
					await getModifiedData();
				})
				.catch(() => {
					items.value = [];
				});
		}

		async function fetchItem(collection, id, fields = []) {
			try {
				if (!collection || !id) return null;
				const primaryKeyField = fieldsStore.getPrimaryKeyFieldForCollection(collection);
				const res = await api.get(getEndpoint(collection), {
					params: { fields: fields, filter: { [primaryKeyField?.field]: id } },
				});
				return res.data.data?.[0] ?? null;
			} catch {
				return null;
			}
		}

		async function mergeRelationDataFromFilter(item: any) {
			try {
				for (const keyField of filterKeyFields) {
					const value = await getValueFromPath(item, keyField);

					if (value) {
						set(item, keyField, value);
					}
				}
				return item;
			} catch {
				return item;
			}
		}

		async function getValueFromPath(item, path) {
			let value = null;
			const keys = path.split('.');
			const findKeys = [];

			try {
				for (let i = 0; i < keys.length; i++) {
					if (has(item, keys.slice(0, i + 1))) {
						findKeys.push(keys[i]);
						value = get(item, findKeys);
						continue;
					}
					break;
				}

				if (findKeys.length === keys.length) return value;

				const field = fieldsStore.getField(relationInfo.relatedCollection.collection, findKeys.join('.'));
				const collection = field?.schema?.foreign_key_table;
				const pk = field?.schema?.foreign_key_column;
				const id = value instanceof Object ? value?.[pk] : value;
				const fields = keys.slice(findKeys.length).join('.');
				let record = await fetchItem(collection, id, fields);
				if (value instanceof Object) {
					record = { ...record, ...value };
				}
				return get(record, fields);
			} catch {
				return null;
			}
		}

		async function getModifiedData() {
			const data: Item = get(values.value, props.lookupField);
			const pkField = relationInfo.relatedPrimaryKeyField.field;
			// console.log({ data, relationInfo, filterKeyFields });
			if (!data?.create) return;

			if (relationInfo.type === 'm2m') {
				for (let payload of data.create) {
					const value = get(payload, relationInfo.relation.field);
					const record = await fetchItem(
						relationInfo.relatedCollection.collection,
						get(value, pkField),
						viewFields.concat(filterKeyFields)
					);
					let item = { ...record, ...value };
					item = await mergeRelationDataFromFilter(item);

					// console.log({ value, item });

					if (filterItems([item], props.filter).length) {
						items.value.push(item);
					}
				}
				for (let payload of data.update) {
					let value = get(payload, relationInfo.junctionField.field) ?? {};
					let existedItem = items.value.find((item: any) => item[pkField] == value?.[pkField]);

					if (existedItem) {
						value = await mergeRelationDataFromFilter(value);
						items.value = items.value.map((item) => {
							if (item?.[pkField] === value?.[pkField]) {
								item = { ...existedItem, ...value };
							}
							return item;
						});
					} else {
						let item = await fetchItem(
							relationInfo.relatedCollection.collection,
							get(value, pkField),
							viewFields.concat(filterKeyFields)
						);
						item = { ...item, ...value };
						item = await mergeRelationDataFromFilter(item);
						items.value.push(item);
					}
					items.value = filterItems(items.value, props.filter);
				}
				for (let id of data.delete) {
					const record = await fetchItem(relationInfo.junctionField.collection, id);
					items.value = items.value.filter((item) => item[pkField] !== record?.[relationInfo.junctionField.field]);
				}
			}

			if (relationInfo.type === 'o2m') {
				// console.log({ data });
				for (let payload of data.create) {
					const item = mergeRelationDataFromFilter(payload);
					if (filterItems([item], props.filter).length) {
						items.value.push(item);
					}
				}
				for (let payload of data.update) {
					let record = await fetchItem(
						relationInfo.relatedPrimaryKeyField.collection,
						get(payload, pkField),
						viewFields.concat(filterKeyFields)
					);
					if (!record) return;

					record = { ...record, ...payload };
					record = await mergeRelationDataFromFilter(record);

					let existedItem = items.value.find((item: any) => item[pkField] == record?.[pkField]);

					if (existedItem) {
						items.value = items.value.map((item) => {
							if (item[pkField] === record?.[pkField]) {
								item = { ...existedItem, ...record };
							}
							return item;
						});
					} else {
						items.value.push(record);
					}
					items.value = filterItems(items.value, props.filter);
				}
				for (let id of data.delete) {
					items.value = items.value.filter((e) => e[relationInfo.relatedPrimaryKeyField.field] !== id);
				}
			}
		}
	},
});
</script>
