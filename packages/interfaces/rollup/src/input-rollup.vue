<template>
	<div class="interface">
		<v-skeleton-loader v-if="loading" />

		<v-notice v-if="!relationField || !rollupField || !rollupFieldObj" type="warning">
			<template v-if="!relationField || !rollupField">
				{{ `Invalid interface options.` }}
			</template>
			<template v-else>
				{{ `Interface doesn't exist.` }}
			</template>
		</v-notice>

		<component
			:is="
				rollupFieldObj.meta?.interface
					? `interface-${rollupFieldObj.meta.interface}`
					: `interface-${getDefaultInterfaceForType(rollupFieldObj.type)}`
			"
			v-else
			v-bind="rollupFieldObj.meta?.options || {}"
			:width="rollupFieldObj.meta?.width || 'full'"
			:type="rollupFieldObj.type"
			:collection="rollupFieldObj.collection"
			:field="rollupFieldObj.field"
			:field-data="rollupFieldObj"
			:value="localValue === undefined ? rollupFieldObj.schema?.default_value : localValue"
			:loading="loading"
			disabled
			@update:model-value="emitValue"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, inject, watch } from 'vue';
import { useApi, useStores } from '@directus/extensions-sdk';
import { Filter, Item } from '@directus/shared/types';
import { getEndpoint } from '@directus/shared/utils';
import { sum, mean, min, max, first, orderBy, round, isEqual, cloneDeep, get, set, has } from 'lodash';
import { getDefaultInterfaceForType } from './utils/get-default-interface-for-type';
import { RelationM2M } from './composables/use-relation-m2m';
import { RelationO2M } from './composables/use-relation-o2m';
import { useRelation } from './composables/use-relation';
import { getFields } from './composables/use-filter';
import { filterItems } from './composables/filter-items';

export default defineComponent({
	props: {
		value: {
			type: [String, Number],
			default: null,
		},
		relationField: {
			type: String,
			required: true,
		},
		rollupField: {
			type: String,
			required: true,
		},
		function: {
			type: String as PropType<
				'count' | 'counta' | 'countd' | 'countn' | 'sum' | 'avg' | 'min' | 'max' | 'first' | 'last'
			>,
			required: true,
		},
		sortBy: {
			type: String,
			default: null,
		},
		primaryKey: {
			type: [String, Number],
			required: true,
		},
		collection: {
			type: String,
			required: true,
		},
		field: {
			type: String,
			required: true,
		},
		filter: {
			type: Object as PropType<Filter>,
			default: () => ({}),
		},
	},
	emits: ['input'],
	setup(props, { emit }) {
		const localValue = ref<string | number>(props.value);
		const loading = ref<boolean>(false);

		const api = useApi();
		const stores = useStores();
		const { useFieldsStore, useRelationsStore } = stores;
		const fieldsStore = useFieldsStore();
		const relationsStore = useRelationsStore();
		const values = inject('values', ref<Record<string, any>>({}));

		const currentFieldObj = fieldsStore.getFieldsForCollection(props.collection).find((e) => e.field === props.field);

		const collectionRelation = relationsStore
			.getRelationsForCollection(props.collection)
			.find((relation: any) => relation?.meta?.one_field == props.relationField);
		const relatedCollection = collectionRelation?.collection;
		const relatedCollectionPK = fieldsStore.getPrimaryKeyFieldForCollection(relatedCollection)?.field;

		const rollupFieldObj =
			props.rollupField && relatedCollection
				? cloneDeep(fieldsStore.getField(relatedCollection, props.rollupField))
				: null;

		const relationInfo: RelationM2M | RelationO2M | undefined = useRelation(
			props.collection,
			props.relationField,
			stores
		);

		const filterKeyFields = getFields(props.filter);
		const items = ref([]);

		if (relationInfo) {
			if (values.value[props.relationField]) {
				getItems();
			}

			watch(
				() => cloneDeep(values.value[props.relationField]),
				async (newValue, oldValue) => {
					if (newValue == null && oldValue == null) return;

					if (!isEqual(newValue, oldValue)) {
						await getItems();
					}
				}
			);
		}

		return { emitValue, loading, localValue, rollupFieldObj, getDefaultInterfaceForType };

		function emitValue(value: any): void {
			localValue.value = cast(value);

			if (!['first', 'last'].includes(props.function)) {
				rollupFieldObj.meta.interface = 'input';
			}

			switch (rollupFieldObj?.meta?.interface) {
				case 'list':
				case 'select-multiple-checkbox':
				case 'select-multiple-checkbox-tree':
				case 'select-multiple-dropdown':
				case 'tags':
					localValue.value = JSON.parse(value ?? null);
					break;

				case 'input-formula':
					rollupFieldObj.meta.interface = 'input';
					break;
			}

			emit('input', localValue.value);
		}

		function calculate(input: Array<any>, func: string) {
			if (!['count', 'counta', 'countd', 'countn'].includes(func) && input?.length == 0) return undefined;

			switch (func) {
				case 'counta': // Count all including empty or null values
					input = input.map((el: any) => el[props.rollupField]);
					break;

				case 'countd': // Count unique values
					input = input
						.map((el: any) => el[props.rollupField])
						.filter((el: any, index: number, self: any[]) => el != null && el != '' && self.indexOf(el) === index);
					break;

				case 'countn': // Count empty and null values
					input = input.map((el: any) => el[props.rollupField]).filter((el: any) => el == null || el == '');
					break;

				case 'count': // Count non-empty and not null values
				case 'sum':
				case 'avg':
				case 'min':
				case 'max':
					input = input.map((el: any) => el[props.rollupField]).filter((el: any) => el != null && el != '');
					break;
			}

			switch (func) {
				case 'count':
				case 'counta':
				case 'countd':
				case 'countn':
					return input.length;

				case 'sum':
					return sum(input);

				case 'avg':
					return mean(input);

				case 'min':
					return min(input);

				case 'max':
					return max(input);

				case 'first':
					return first(orderBy(input, [props.sortBy], 'asc'))?.[props.rollupField];

				case 'last':
					return first(orderBy(input, [props.sortBy], 'desc'))?.[props.rollupField];
			}
		}

		function cast(value: any) {
			if (value === null || value === undefined || value === '' || value === {} || value === []) return undefined;

			const schema = currentFieldObj.schema;

			switch (schema.data_type) {
				case 'decimal':
				case 'float':
					return round(value, schema.numeric_scale) ?? undefined;

				case 'int':
				case 'bigint':
					return round(value) ?? undefined;

				case 'string':
				case 'text':
				case 'varchar':
				case 'char':
					return value.toString().substring(0, schema.max_length || undefined);

				case 'boolean':
					if (['true', '1'].includes(String(value).toLowerCase())) {
						return true;
					} else if (['false', '0'].includes(String(value).toLowerCase())) {
						return false;
					} else {
						return undefined;
					}

				default:
					return value;
			}
		}

		async function getItems() {
			loading.value = true;
			if (!relationInfo) return null;

			const collection = relationInfo.relatedCollection.collection;
			const keys = props.rollupField.split('.');
			keys.pop();
			const path = keys.join('.') || relatedCollectionPK;
			const value = get(values.value, path ?? relatedCollectionPK);
			const id = value instanceof Object ? value?.[relatedCollectionPK] : value;

			// console.log({ path, relatedCollectionPK, value, id });
			if (!id) {
				items.value = [];
				await getModifiedData();

				if (items.value?.length > 0) {
					emitValue(calculate(items.value, props.function) ?? currentFieldObj.schema?.default_value);
				} else {
					emitValue(currentFieldObj.schema?.default_value);
				}

				loading.value = false;
				return;
			}

			const fields = [relatedCollectionPK, props.rollupField, props.sortBy].filter((val: any) => val);
			const filter = Object.keys(props.filter).length > 0 ? cloneDeep(props.filter) : { _and: [] };

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
				.get(getEndpoint(collection), { params: { fields, filter } })
				.then(async (res) => {
					items.value = res?.data?.data ?? [];
					await getModifiedData();
					if (items.value?.length > 0) {
						emitValue(calculate(items.value, props.function) ?? currentFieldObj.schema?.default_value);
					} else {
						emitValue(currentFieldObj.schema?.default_value);
					}
				})
				.catch(() => {
					items.value = [];
				})
				.finally(() => {
					loading.value = false;
				});
		}

		async function fetchItem(collection: string, id: string | number, fields = []) {
			try {
				if (!collection || !id) return null;
				const res = await api.get(getEndpoint(collection), {
					params: { fields: fields, filter: { [relatedCollectionPK]: id } },
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

		async function getValueFromPath(item: any, path: string) {
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
				const fields = keys.slice(findKeys.length);
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
			const data: Item = get(values.value, props.relationField);
			const pkField = relationInfo.relatedPrimaryKeyField.field;

			// console.log(data, relationInfo, filterKeyFields);

			if (!data?.create) return;

			if (relationInfo.type === 'm2m') {
				for (let payload of data.create) {
					const value = get(payload, relationInfo.relation.field);
					const record = await fetchItem(
						relationInfo.relatedCollection.collection,
						get(value, pkField),
						[relatedCollectionPK, props.rollupField, props.sortBy].concat(filterKeyFields)
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
							[relatedCollectionPK, props.rollupField, props.sortBy].concat(filterKeyFields)
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
						[relatedCollectionPK, props.rollupField, props.sortBy].concat(filterKeyFields)
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

				// console.log(data, relationInfo, items.value, props.filter, filterKeyFields);
			}
		}
	},
});
</script>
<style scoped>
.interface {
	position: relative;
}

.v-skeleton-loader {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 2;
	width: 100%;
	height: 100%;
}
</style>
