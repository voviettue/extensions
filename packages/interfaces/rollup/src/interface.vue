<template>
	<div class="interface">
		<v-skeleton-loader v-if="loading" />

		<v-notice v-if="!relationField || !rollupField" type="warning">
			<template v-if="!relationField || !rollupField">
				{{ `Invalid interface options.` }}
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
import { Filter } from '@directus/shared/types';
import { sum, mean, min, max, first, orderBy, round, isEqual, merge, cloneDeep } from 'lodash';
import { getDefaultInterfaceForType } from './get-default-interface-for-type';

type ChangesItem = {
	create: Record<string, any>[];
	update: Record<string, any>[];
	delete: (string | number)[];
};

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
		const { useFieldsStore, useRelationsStore } = useStores();
		const fieldsStore = useFieldsStore();
		const relationsStore = useRelationsStore();
		const values = inject('values', ref<Record<string, any>>({}));

		const currentFieldObj = fieldsStore.getFieldsForCollection(props.collection).find((e) => e.field === props.field);

		const collectionRelation = relationsStore
			.getRelationsForCollection(props.collection)
			.find((relation: any) => relation?.meta?.one_field == props.relationField);
		const relatedCollection = collectionRelation?.collection;
		const relatedCollectionFK = collectionRelation?.field;

		const relatedCollectionPK = fieldsStore.getPrimaryKeyFieldForCollection(relatedCollection)?.field;
		const rollupFieldObj = cloneDeep(fieldsStore.getField(relatedCollection, props.rollupField));

		watch(
			() => cloneDeep(values.value[props.relationField]),
			async (newValue, oldValue) => {
				if (newValue == null && oldValue == null) return;

				if (!isEqual(newValue, oldValue)) {
					await rollupItems(newValue);
				}
			}
		);

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

		function buildFilter(items: ChangesItem) {
			if (props.primaryKey == '+') {
				if (items?.update?.length > 0) {
					return {
						[relatedCollectionPK]: { _in: items.update.map((item: any) => item[relatedCollectionPK]) },
					};
				} else {
					return;
				}
			} else {
				if (items?.update?.length > 0) {
					return {
						_or: [
							{
								[relatedCollectionPK]: { _in: items.update.map((item: any) => item[relatedCollectionPK]) },
							},
							{
								[relatedCollectionFK]: { _eq: props.primaryKey },
							},
						],
					};
				} else {
					return { [relatedCollectionFK]: { _eq: props.primaryKey } };
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
					const updateItem = items.update.find((item: any) => item[relatedCollectionPK] == val[relatedCollectionPK]);
					if (updateItem) {
						val = Object.assign({}, val, updateItem);
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

				const url =
					relatedCollection.startsWith('directus_') === true
						? relatedCollection.replace('directus_', '')
						: `items/${relatedCollection}`;
				const filter = buildFilter(items) ? merge(buildFilter(items), props.filter) : null;
				const fields = [relatedCollectionPK, props.rollupField, props.sortBy].filter((val: any) => val).join(',');

				if (relatedCollection && filter) {
					const res = await api.get(url, { params: { filter, fields, limit: -1 } });

					itemValues = res.data.data;
				}

				itemValues = buildValues(items, itemValues);

				if (itemValues?.length > 0) {
					emitValue(calculate(itemValues, props.function) ?? currentFieldObj.schema?.default_value);
				} else {
					emitValue(currentFieldObj.schema?.default_value);
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
