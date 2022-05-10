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

		const relatedCollectionFields = computed(() => {
			const selectedRelatedCollection = field.meta?.options?.o2mCollection;
			const selectedFunction = field.meta?.options?.function;

			if (selectedRelatedCollection) {
				return fieldsStore.getFieldsForCollection(selectedRelatedCollection).map((el: any) => {
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
						disabled: selectedFunction == 'count' ? false : isDisabled,
					}
				});
			} else {
				return null;
			}
		});

		const supportNumberCalculation = computed(() =>
			field.type ? ['integer', 'bigInteger', 'float', 'decimal'].includes(field.type) : false
		);

		const o2mCollections = relationsStore.getRelationsForCollection(collection)
			.filter((relation :any) =>
				relation.related_collection === collection
				&& relation?.meta?.junction_field === null
			);

		return [
			{
				field: 'o2mCollection',
				type: 'string',
				name: 'Related Collection',
				meta: {
					width: 'half',
					interface: 'select-dropdown',
					options: {
						choices: o2mCollections.map((el: any) => ({
							text: formatTitle(el.collection),
							value: el.collection,
						})),
						placeholder: 'Select collection that links to the records you want to summarize',
						allowNone: false,
					},
				},
			},
			{
				field: 'o2mField',
				type: 'string',
				name: 'Related Collection Field',
				meta: {
					interface: 'select-dropdown',
					options: {
						choices: relatedCollectionFields.value,
						placeholder: `Choose ${collection} collection field that you'd like to aggregate`,
						allowNone: false,
					},
					width: 'half',
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
							{ text: 'FIRST', value: 'first', disabled: false },
							{ text: 'LAST', value: 'last', disabled: false },
							{ divider: true },
							{ text: 'COUNT', value: 'count', disabled: !supportNumberCalculation.value },
							{ text: 'SUM', value: 'sum', disabled: !supportNumberCalculation.value },
							{ text: 'AVERAGE', value: 'avg', disabled: !supportNumberCalculation.value },
							{ text: 'MINIMUM', value: 'min', disabled: !supportNumberCalculation.value },
							{ text: 'MAXIMUM', value: 'max', disabled: !supportNumberCalculation.value },
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
					interface: 'system-field',
					options: {
						collectionField: 'o2mCollection',
						allowPrimaryKey: true,
						allowNone: false,
					},
					width: 'half',
				},
			},
			{
				field: 'filter',
				type: 'json',
				name: 'Filter',
				meta: {
					interface: 'system-filter',
					options: {
						collectionField: 'o2mCollection',
					},
				},
			},
		];
	},
});
