import { defineQuery } from '../../utils/define-extension';

let selectedCollection: any = '';

export default defineQuery({
	id: 'item',
	name: 'Item',
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
				field: 'primaryValue',
				name: 'Primary Key Value',
				type: 'string',
				meta: {
					width: 'full',
					interface: 'input',
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
		];

		return options;
	},
});
