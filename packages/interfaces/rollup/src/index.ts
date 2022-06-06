import InterfaceComponent from './interface.vue';
import { computed, watch } from 'vue';
import { defineInterface } from '@directus/extensions-sdk';
import { useStores } from '@directus/extensions-sdk';
import formatTitle from '@directus/format-title';

export default defineInterface({
	id: 'input-rollup',
	name: 'Rollup',
	icon: 'merge',
	description: 'Summarize data from records that are linked to this collection',
	component: InterfaceComponent,
	group: 'standard',
	types: [
		'string',
		'text',
		'decimal',
		'float',
		'integer',
		'bigInteger',
		'date',
		'dateTime',
		'time',
		'timestamp',
		'boolean',
		'uuid',
	],
	recommendedDisplays: ['formatted-value'],
	options: ({ collection, field }) => {
		const { useRelationsStore, useFieldsStore } = useStores();
		const relationsStore = useRelationsStore();
		const fieldsStore = useFieldsStore();

		watch(
			() => field.type,
			(newType, oldType) => {
				if (newType != oldType && field.meta?.options) {
					field.meta.options = undefined;
				}
			},
			{ deep: true }
		);

		// Support O2M collections
		const collectionRelations = relationsStore
			.getRelationsForCollection(collection)
			.filter(
				(relation: any) =>
					relation.related_collection === collection &&
					relation?.meta?.junction_field === null &&
					relation?.meta?.one_field !== null
			);
		const relatedCollectionOptions = collectionRelations.map((el: any) => {
			const text = `${formatTitle(el.collection.replace('directus_', 'system_'))} (${
				el.meta?.one_field ?? 'undefined'
			})`;
			const value = `${el.meta?.one_field}`;

			return { text, value };
		});

		const selectedRelatedCollection = computed(() => {
			return collectionRelations.find(
				(relation: any) => relation?.meta?.one_field == field.meta?.options?.relationField
			)?.collection;
		});
		const relatedCollectionFields = computed(() => {
			return fieldsStore.getFieldsForCollection(selectedRelatedCollection.value);
		});

		const rollupFieldOptions = computed(() => {
			const selectedFunction = field.meta?.options?.function;

			if (relatedCollectionFields.value) {
				return relatedCollectionFields.value.map((el: any) => {
					let isDisabled = true;

					switch (field.type) {
						case 'string':
						case 'text':
						case 'json':
						case 'csv':
							isDisabled = false;
							break;

						case 'integer':
						case 'bigInteger':
						case 'float':
						case 'decimal':
							isDisabled = !['integer', 'bigInteger', 'float', 'decimal'].includes(el.type);
							break;

						case el.type:
							isDisabled = false;
							break;
					}

					return {
						text: el.name,
						value: el.field,
						disabled: ['count', 'counta', 'countd', 'countn'].includes(selectedFunction) ? false : isDisabled,
					};
				});
			} else {
				return null;
			}
		});

		const sortFieldOptions = computed(() => {
			return relatedCollectionFields.value.map((el: any) => {
				return {
					text: el.name,
					value: el.field,
				};
			});
		});

		const supportNumberCalculation = computed(() =>
			field.type ? ['integer', 'bigInteger', 'float', 'decimal'].includes(field.type) : false
		);

		return [
			{
				field: 'relationField',
				type: 'string',
				name: 'Related Collection',
				meta: {
					width: 'half',
					interface: 'select-dropdown',
					options: {
						choices: relatedCollectionOptions,
						placeholder: 'Select related collection',
						allowNone: false,
					},
				},
			},
			{
				field: 'rollupField',
				type: 'string',
				name: 'Related Collection Field',
				meta: {
					width: 'half',
					interface: 'select-dropdown',
					options: {
						choices: rollupFieldOptions.value,
						placeholder: 'Select related field',
						allowNone: false,
					},
				},
			},
			{
				field: 'function',
				type: 'string',
				name: 'Aggregation Function',
				meta: {
					width: 'half',
					interface: 'select-dropdown',
					options: {
						choices: [
							{ text: 'FIRST — Returns the first value, according to sorting', value: 'first', disabled: false },
							{ text: 'LAST — Returns the last value, according to sorting', value: 'last', disabled: false },
							{ divider: true },
							{
								text: 'COUNT — Count only non-empty values',
								value: 'count',
								disabled: !supportNumberCalculation.value,
							},
							{
								text: 'COUNTA — Count all number of items including blank values',
								value: 'counta',
								disabled: !supportNumberCalculation.value,
							},
							{
								text: 'COUNTD — Count unique values (except empty values)',
								value: 'countd',
								disabled: !supportNumberCalculation.value,
							},
							{
								text: 'COUNTN — Count the number of empty values',
								value: 'countn',
								disabled: !supportNumberCalculation.value,
							},
							{ divider: true },
							{ text: 'SUM — Sum together the values', value: 'sum', disabled: !supportNumberCalculation.value },
							{
								text: 'AVERAGE — Arithmetic mean of the values',
								value: 'avg',
								disabled: !supportNumberCalculation.value,
							},
							{
								text: 'MINIMUM — Returns the smallest value, ignoring empty fields',
								value: 'min',
								disabled: !supportNumberCalculation.value,
							},
							{
								text: 'MAXIMUM — Returns the largest value, ignoring empty fields',
								value: 'max',
								disabled: !supportNumberCalculation.value,
							},
						],
						placeholder: 'Select function',
						allowNone: false,
					},
				},
			},
			{
				field: 'sortBy',
				type: 'string',
				name: 'Sort Field',
				meta: {
					width: 'half',
					interface: 'select-dropdown',
					options: {
						choices: sortFieldOptions.value,
						placeholder: 'Select sort field',
						allowNone: false,
					},
				},
			},
			{
				field: 'filter',
				type: 'json',
				name: 'Filter',
				meta: {
					interface: 'system-filter',
					options: {
						collectionName: selectedRelatedCollection.value,
					},
				},
			},
		];
	},
});
