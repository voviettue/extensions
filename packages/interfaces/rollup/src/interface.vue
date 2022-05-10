<template>
	<v-input :model-value="localValue" @update:model-value="emitValue" :disabled="true" :readonly="true">
		<template #append><v-progress-circular v-if="loading" indeterminate /></template>
	</v-input>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, inject, watch } from 'vue';
import { useApi, useStores } from '@directus/extensions-sdk';
import { Filter } from '@directus/shared/types';
import { sum, mean, min, max, first, orderBy, round, isEqual, merge } from 'lodash';

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
			type: String as PropType<'count' | 'sum' | 'avg' | 'min' | 'max' | 'first' | 'last'>,
			required: true,
		},
		sortBy: {
			type: String,
			default: null,
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
		const localValue = ref(props.value);
		const loading = ref<boolean>(false);

		const api = useApi();
		const { useRelationsStore, useFieldsStore } = useStores();
		const relationsStore = useRelationsStore();
		const fieldsStore = useFieldsStore();

		const values = inject('values', ref<Record<string, any>>({}));
		const collectionRelations = relationsStore.getRelationsForCollection(props.collection);

		const oneField = collectionRelations
			.filter((el :any) => el.collection === props.o2mCollection && el.meta?.one_field)[0]?.meta?.one_field;

		const currentField = fieldsStore.getFieldsForCollection(props.collection)
			.find((e) => e.field === props.field);

		const relatedCollectionPK = fieldsStore.getPrimaryKeyFieldForCollection(props.o2mCollection)?.field;

		watch(
			() => values.value[oneField],
			(newValue, oldValue) => {
				if (newValue == null && oldValue == null) return;

				if (!isEqual(newValue, oldValue)) {
					fetchItemValues(values.value[oneField]);
				}
			},
			{ deep: true }
		);

		if (!props.value) fetchItemValues(values.value[oneField]);

		return { emitValue, loading, localValue };

		function emitValue(value: any): void {
			localValue.value = cast(value);
			emit('input', localValue.value);
		}

		function calculate(input: Array<any>, func: string) {
			if (func != 'count' && input.length == 0) return;

			if (['count', 'sum', 'avg', 'min', 'max'].includes(func)) {
				input = input.map((el: any) => el[props.o2mField]);
			}

			switch (func) {
				case 'count':
					return input.length;

				case 'sum':
					return sum(input) || 0;

				case 'avg':
					return mean(input) || 0;

				case 'min':
					return min(input) || 0;

				case 'max':
					return max(input) || 0;

				case 'first':
					return first(orderBy(input, [props.sortBy], 'asc'))?.[props.o2mField];

				case 'last':
					return first(orderBy(input, [props.sortBy], 'desc'))?.[props.o2mField];
			}
		}

		async function fetchItemValues(items: Array<Object | number>) {
			if (!items || items?.length === 0) {
				emitValue(currentField.schema?.default_value ?? undefined);
				return;
			}

			loading.value = true;

			try {
				let itemValues = [];

				const ids = items.map((el: any) => {
					if (typeof el === 'number') return el;

					if (
						typeof el === 'object'
						&& el.hasOwnProperty(relatedCollectionPK)
					) return el[relatedCollectionPK];
				});

				if (ids?.length > 0) {
					const filter = merge({ [relatedCollectionPK]: { '_in': ids } }, props.filter);
					const fields = [relatedCollectionPK, props.o2mField, props.sortBy].filter((val: any) => val).join(',');

					const res = await api.get(`items/${props.o2mCollection}`, {
						params: {
							filter,
							fields,
							limit: -1,
						},
					});

					itemValues = res.data.data
						.filter((el: any) =>
							el.hasOwnProperty(props.o2mField)
							&& !['null', '', '[]', '{}'].includes(JSON.stringify(el[props.o2mField]))
						);
				}

				items.forEach((el: any) => {
					// Check if change related item form data (did not submitted yet)
					if (el.hasOwnProperty(relatedCollectionPK)) {
						// Edit related field in case the item has inserted
						// Check if existed in the itemValues, change the value of the field
						if (itemValues.find((elValue: any) => elValue[relatedCollectionPK] === el[relatedCollectionPK])) {
							itemValues = itemValues.map((elValue: any) => {
								return elValue[relatedCollectionPK] == el[relatedCollectionPK]
								? {
										...elValue,
										[props.o2mField]: el.hasOwnProperty(props.o2mField) ? cast(el[props.o2mField]) : cast(elValue[props.o2mField]),
										[props.sortBy]: el.hasOwnProperty(props.sortBy) ? el[props.sortBy] : elValue[props.sortBy]
									}
								: elValue;
							});
						} else {
							// Push new item in case the item was not existed in the itemValues
							itemValues.push({
								[relatedCollectionPK]: el[relatedCollectionPK],
								[props.o2mField]: cast(el[props.o2mField]),
								[props.sortBy]: el[props.sortBy]
							});
						}
					} else if (el.hasOwnProperty(props.o2mField)) {
						itemValues.push({
							[props.o2mField]: cast(el[props.o2mField]),
							[props.sortBy]: el[props.sortBy]
						});
					}
				});

				emitValue(calculate(itemValues, props.function));
			} catch (err) {
				console.log(err);
			} finally {
				loading.value = false;
			}
		}

		function cast(value) {
			if (typeof value == 'object') {
				value = JSON.stringify(value);
			}

			if (typeof value == 'undefined' || value == 'null') {
				return undefined;
			}

			const schema = currentField.schema;

			switch (schema.data_type) {
				case 'decimal':
				case 'float':
					return round(value, schema.numeric_scale) || 0;

				case 'int':
				case 'bigint':
					return round(value) || 0;

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
