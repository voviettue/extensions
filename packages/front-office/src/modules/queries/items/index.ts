import { defineQuery } from '../../utils/define-extension';

let selectedCollection: any = '';

export default defineQuery({
	id: 'items',
	name: 'Items',
	icon: 'manage_search',
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
				field: 'per_page',
				name: 'Per Page',
				type: 'integer',
				meta: {
					interface: 'input',
					options: {
						trim: true,
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
