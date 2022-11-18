import { defineQuery } from '../../utils/define-extension';

let selectedCollection: any = '';

export default defineQuery({
	id: 'items',
	name: 'Get Items',
	icon: 'install_desktop',
	options: ({ values }) => {
		const collection = values?.options?.collection || '';

		if (!!selectedCollection && selectedCollection !== collection) {
			values.options.fields = undefined;
			values.options.filter = undefined;
		}
		selectedCollection = collection;

		const options = [
			{
				collection: 'cms_queries',
				field: 'perPage',
				name: 'Per Page',
				type: 'integer',
				meta: {
					interface: 'select-dropdown',
					options: {
						choices: [
							{
								text: '5',
								value: 5,
							},
							{
								text: '10',
								value: 10,
							},
							{
								text: '20',
								value: 20,
							},
							{
								text: '50',
								value: 50,
							},
							{
								text: '100',
								value: 100,
							},
							{
								text: '200',
								value: 200,
							},
						],
						allowOther: true,
						allowNone: true,
					},
				},
				schema: {
					default_value: 20,
					placeholder: 'Text',
				},
			},
			{
				field: 'collection',
				type: 'string',
				name: '$t:collection',
				meta: {
					width: 'full',
					interface: 'system-collection',
					options: {
						includeSystem: true,
					},
					selectedCollection: '',
					hasBeenSelected: false,
				},
			},
			{
				field: 'fields',
				type: 'json',
				name: 'Fields',
				meta: {
					width: 'full',
					interface: 'system-fields',
					options: {
						collectionName: collection,
						placeholder: 'Select review fields',
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
						collectionName: collection,
					},
				},
			},
		];

		return options;
	},
});
