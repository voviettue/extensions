<template>
	<v-input :model-value="localValue" @update:model-value="emitValue" :disabled="true" :readonly="true">
		<template #append><v-progress-circular v-if="loading" indeterminate /></template>
	</v-input>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, inject, watch } from 'vue';
import { useApi, useStores } from '@directus/extensions-sdk';
import { Filter } from '@directus/shared/types';
import { sum, mean, min, max, first, orderBy, round, isEqual, merge, cloneDeep } from 'lodash';

type ChangesItem = {
	create: Record<string, any>[];
	update: Record<string, any>[];
	delete: (string | number)[];
}

export default defineComponent({
	props: {
		value: {
			type: [String, Number],
			default: null,
		},
		o2mCollection: {
			type: String,
			required: true,
		},
		o2mField: {
			type: String,
			required: true,
		},
		function: {
			type: String as PropType<'count' | 'counta' | 'countd' | 'countn' | 'sum' | 'avg' | 'min' | 'max' | 'first' | 'last'>,
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
		const { useFieldsStore, useRelationsStore } = useStores();
		const fieldsStore = useFieldsStore();
		const relationsStore = useRelationsStore();
		const values = inject('values', ref<Record<string, any>>({}));

		const [relatedCollection, oneField] = props.o2mCollection.split('-');

		const currentField = fieldsStore.getFieldsForCollection(props.collection)
			.find((e) => e.field === props.field);

		const relatedCollectionPK = fieldsStore.getPrimaryKeyFieldForCollection(relatedCollection)?.field;
		const manyCollectionField = relationsStore.getRelationsForCollection(props.collection)
			.find((relation: any) =>
					relation.meta?.one_collection === props.collection
					&& relation.meta?.many_collection === relatedCollection
					&& relation.meta?.one_field == oneField
			)?.field;

		watch(
			() => cloneDeep(values.value[oneField]),
			async (newValue, oldValue) => {
				if (newValue == null && oldValue == null) return;

				if (!isEqual(newValue, oldValue)) {
					await rollupItems(newValue);
				}
			},
		);

		return { emitValue, loading, localValue };

		function emitValue(value: any): void {
			localValue.value = cast(value);
			emit('input', localValue.value);
		}

		function calculate(input: Array<any>, func: string) {
			switch (func) {
				case 'counta': // Count all including empty or null values
					input = input.map((el: any) => el[props.o2mField]);
					break;

				case 'countd': // Count unique values
					input = input.map((el: any) => el[props.o2mField])
						.filter((el: any, index: number, self: any[]) => (el != null && el != '') && self.indexOf(el) === index);
					break;

				case 'countn': // Count empty and null values
					input = input.map((el: any) => el[props.o2mField]).filter((el: any) => el == null || el == '');
					break;

				case 'count': // Count non-empty and not null values
				case 'sum':
				case 'avg':
				case 'min':
				case 'max':
					input = input.map((el: any) => el[props.o2mField]).filter((el: any) => el != null && el != '');
					break;
			}

			if (!['count', 'counta', 'countd', 'countn'].includes(func) && input.length == 0) return undefined;

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
					return first(orderBy(input, [props.sortBy], 'asc'))?.[props.o2mField];

				case 'last':
					return first(orderBy(input, [props.sortBy], 'desc'))?.[props.o2mField];
			}
		}

		function buildFilter(items: ChangesItem) {
			if (props.primaryKey == '+') {
				if (items?.update?.length > 0) {
					return {
						[relatedCollectionPK]: { '_in': items.update.map((item: any) => item[relatedCollectionPK]) }
					};
				} else {
					return;
				}
			} else {
				if (items?.update?.length > 0) {
					return {
						'_or': [
							{
								[relatedCollectionPK]: { '_in': items.update.map((item: any) => item[relatedCollectionPK]) }
							},
							{
								[manyCollectionField]: { '_eq': props.primaryKey }
							}
						]
					};
				} else {
					return { [manyCollectionField]: { '_eq': props.primaryKey } };
				}
			}
		}

		function buildValues(items: ChangesItem, fetchValues: any) {
			let values = fetchValues;

			if (items?.create?.length > 0) {
				values.push(...items.create);
			}

			if (items?.update?.length > 0) {
				values = values.map((val: any) => {
					const updateItem = items.update
						.find((item: any) => item[relatedCollectionPK] == val[relatedCollectionPK]);
					if (updateItem) {
						val = Object.assign({}, val, updateItem)
					}
					return val;
				});
			}

			if (items?.delete?.length > 0) {
				values = fetchValues.filter((val: any) => !items.delete.includes(val[relatedCollectionPK]));
			}

			return values;
		}

		async function rollupItems(items: ChangesItem) {
			loading.value = true;

			try {
				let itemValues = [];

				const url = relatedCollection.startsWith('directus_') === true
					? relatedCollection.replace('directus_', '')
					: `items/${relatedCollection}`;
				const filter = buildFilter(items) ? merge(buildFilter(items), props.filter) : null;
				const fields = [relatedCollectionPK, props.o2mField, props.sortBy].filter((val: any) => val).join(',');

				if (relatedCollection && filter) {
					const res = await api.get(url, { params: { filter, fields, limit: -1 } });

					itemValues = res.data.data;
				}

				itemValues = buildValues(items, itemValues);

				if (itemValues?.length > 0) {
					emitValue(calculate(itemValues, props.function));
				} else {
					emitValue(currentField.schema?.default_value ?? undefined);
				}
			} catch (err) {
				console.log(err);
			} finally {
				loading.value = false;
			}
		}

		function cast(value: any) {
			if (value === null) return undefined;
			if (typeof value == 'object') value = JSON.stringify(value);
			if (typeof value == 'undefined') return undefined;

			const schema = currentField.schema;

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
	},
});
</script>
