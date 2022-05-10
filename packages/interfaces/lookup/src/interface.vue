<template>
	<v-input :model-value="localValue" :disabled="true" :readonly="true" @update:model-value="emitValue">
		<template #append><v-progress-circular v-if="loading" indeterminate /></template>
	</v-input>
</template>

<script lang="ts">
import { defineComponent, ref, watch, inject } from 'vue';
import { useApi, useStores } from '@directus/extensions-sdk';
import { isEqual, round } from 'lodash';
import { parse, parseISO, isValid } from 'date-fns';

export default defineComponent({
	props: {
		value: {
			type: [String, Number],
			default: null,
		},
		relatedCollection: {
			type: String,
			required: true,
		},
		relatedCollectionField: {
			type: String,
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
	},
	emits: ['input'],
	setup(props, { emit }) {
		const localValue = ref<string | number>(props.value);
		const loading = ref<boolean>(false);

		const api = useApi();
		const { useRelationsStore, useFieldsStore } = useStores();
		const relationsStore = useRelationsStore();
		const fieldsStore = useFieldsStore();
		const values = inject('values', ref<Record<string, any>>({}));

		const currentField = fieldsStore.getFieldsForCollection(props.collection)
			.find((e) => e.field === props.field);
		const relatedCollectionPK = fieldsStore.getPrimaryKeyFieldForCollection(props.relatedCollection)?.field;

		const collectionRelations = relationsStore.getRelationsForCollection(props.relatedCollection);

		// O2M
		const manyField = collectionRelations
			.find(
				(el: any) =>
					el.collection === props.relatedCollection
					&& el.meta?.one_collection === props.collection
			)?.meta?.one_field;

		// M2O
		const oneField = collectionRelations
			.find(
				(el: any) =>
					el.collection === props.collection
					&& el.related_collection === props.relatedCollection
			)?.field;

		const watchField = manyField || oneField;

		watch(
			() => values.value[watchField],
			(newValue, oldValue) => {
				if (newValue == null && oldValue == null) return;

				if (!isEqual(newValue, oldValue)) {
					fetchItemValues(values.value[watchField]);
				}
			},
			{ deep: true }
		);

		if (props.value !== null) fetchItemValues(values.value[watchField]);

		return { emitValue, loading, localValue };

		function emitValue(value: any): void {
			localValue.value = cast(value);

			emit('input', localValue.value);
		}

		async function fetchItemValues(items: Array<Object | number>) {
			if (!items || items?.length === 0) {
				emitValue(currentField.schema?.default_value ?? undefined);
				return;
			}

			loading.value = true;

			try {
				let itemValues = [];
				let itemArray = Array.isArray(items) ? items : [items];
				const ids = itemArray.map((el: any) => {
					if (typeof el === 'number') return el;

					if (
						typeof el === 'object'
						&& el.hasOwnProperty(relatedCollectionPK)
					) return el[relatedCollectionPK];
				});

				if (ids?.length > 0 && props.relatedCollection) {
					const filter = { [relatedCollectionPK]: { '_in': ids } };
					const fields = `${relatedCollectionPK},${props.relatedCollectionField}`;

					const res = await api.get(`items/${props.relatedCollection}`, {
						params: {
							filter,
							fields,
						}
					});

					itemValues = res.data.data
						.filter((el: any) =>
							el.hasOwnProperty(props.relatedCollectionField)
							&& !['null', '', '[]', '{}'].includes(JSON.stringify(el[props.relatedCollectionField]))
						)
				}

				itemArray.forEach((el: any) => {
					// Check if change related item form data (did not submitted yet)
					if (el.hasOwnProperty(props.relatedCollectionField) && el.hasOwnProperty(relatedCollectionPK)) {
						// Edit related field in case the item has inserted
						// Check if existed in the itemValues, change the value of the field
						if (itemValues.find((elValue: any) => elValue[relatedCollectionPK] === el[relatedCollectionPK])) {
							itemValues = itemValues.map((elValue: any) => {
								return elValue[relatedCollectionPK] == el[relatedCollectionPK]
								? {
										...elValue,
										[props.relatedCollectionField]: cast(el[props.relatedCollectionField])
									}
								: elValue;
							});
						} else {
							// Push new item in case the item was not existed in the itemValues
							itemValues.push({
								[relatedCollectionPK]: el[relatedCollectionPK],
								[props.relatedCollectionField]: cast(el[props.relatedCollectionField])
							});
						}
					} else if (el.hasOwnProperty(props.relatedCollectionField)) {
						itemValues.push({ [props.relatedCollectionField]: cast(el[props.relatedCollectionField]) });
					}
				});

				const emitValues = itemValues.map((el: any) => cast(el[props.relatedCollectionField]));
				emitValue(emitValues.length > 1 ? emitValues.join(', ') : emitValues[0]);
			} catch (err) {
				console.log(err);
			} finally {
				loading.value = false;
			}
		}

		function cast(value: any) {
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
					return value == 0 ? 0 : round(value, schema.numeric_scale) || undefined;

				case 'int':
				case 'bigint':
					return value == 0 ? 0 : round(value) || undefined;

				case 'boolean':
					if (['true', '1'].includes(String(value).toLowerCase())) {
						return true;
					} else if (['false', '0'].includes(String(value).toLowerCase())) {
						return false;
					} else {
						return undefined;
					}

				case 'string':
				case 'text':
				case 'varchar':
				case 'char':
					return value.toString().substring(0, schema.max_length || undefined);

				case 'datetime':
					const parsedDatetime = parse(value, "yyyy-MM-dd'T'HH:mm:ss", new Date());
					return isValid(parsedDatetime) ? value : undefined;
				case 'date':
					const parsedDate = parse(value, 'yyyy-MM-dd', new Date());
				return isValid(parsedDate) ? value : undefined;
				case 'time':
					const parsedTime = parse(value, 'HH:mm:ss', new Date());
					return isValid(parsedTime) ? value : undefined;
				case 'timestamp':
					const parsedTimestamp = parseISO(value);
					return isValid(parsedTimestamp) ? value : undefined;

				default:
					return value;
			}
		}
	},
});
</script>
