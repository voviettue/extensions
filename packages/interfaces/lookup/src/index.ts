import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';
import { useStores } from '@directus/extensions-sdk';
import formatTitle from '@directus/format-title';
import { watch, computed } from 'vue';

export default defineInterface({
	id: 'input-lookup',
	name: 'Lookup',
	icon: 'manage_search',
	description: 'Lookup a field on linked collection',
	component: InterfaceComponent,
	group: 'standard',
	types: [
		'string',
		'text',
		'decimal',
		'float',
		'integer',
		'bigInteger',
		'boolean',
		'date',
		'dateTime',
		'time',
		'timestamp',
		'uuid',
		'hash',
		'json',
		'csv',
	],
	recommendedDisplays: ['formatted-value'],
	options: ({ collection, field }) => {
		const { useRelationsStore, useFieldsStore } = useStores();
		const relationsStore = useRelationsStore();
		const fieldsStore = useFieldsStore();
		const relatedCollections = relationsStore
			.getRelationsForCollection(collection)
			.filter((relation: any) => relation?.meta?.junction_field === null && relation?.related_collection != collection);

		const relatedCollectionOptions = relatedCollections.map((el: any) => {
			const collectionName = el.related_collection == collection ? el.collection : el.related_collection;
			const relationField = el.related_collection == collection ? el.meta?.one_field : el.field;

			const text = `${formatTitle(collectionName.replace('directus_', 'system_'))} (${relationField})`;
			const value = `${relationField}`;

			return { text, value };
		});

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
			const selectedRelationField = field.meta?.options?.relationField;

			if (selectedRelationField) {
				const selectedRelatedCollection = relationsStore
					.getRelationsForCollection(collection)
					.find((field: any) => field?.field == selectedRelationField)?.related_collection;

				return fieldsStore
					.getFieldsForCollection(selectedRelatedCollection)
					.filter((field: any) => field?.type !== 'alias')
					.map((el: any) => {
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
							disabled: isDisabled,
						};
					});
			} else {
				return null;
			}
		});

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
				field: 'lookupField',
				type: 'string',
				name: 'Related Collection Field',
				meta: {
					interface: 'select-dropdown',
					options: {
						choices: relatedCollectionFields.value,
						placeholder: 'Select related field',
						allowNone: false,
					},
					width: 'half',
				},
			},
		];
	},
});
