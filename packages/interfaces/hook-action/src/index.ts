import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';

export default defineInterface({
	id: 'interface-hook-action',
	name: 'Hook Action',
	icon: 'anchor',
	description: 'You can running your code after event action type is fires!',
	component: InterfaceComponent,
	group: 'other',
	types: ['string'],
	options: () => {
		return [
			{
				field: 'collection',
				name: 'Collection',
				type: 'string',
				meta: {
					interface: 'input',
					width: 'full',
				},
			},
			{
				field: 'action',
				name: 'Action',
				type: 'string',
				meta: {
					interface: 'select-radio',
					width: 'full',
					options: {
						choices: [
							{ text: 'Create', value: 'create' },
							{ text: 'Update', value: 'update' },
							{ text: 'Delete', value: 'delete' },
						],
					},
				},
			},
			{
				field: 'code',
				name: 'Code',
				type: 'string',
				meta: {
					interface: 'input-multiline',
					width: 'full',
					options: {
						placeholder:
							'Support 2 arguments \n 1. An event-specific meta object \n 2. A context object \nYou can use it by using arguments object.',
					},
				},
			},
		];
	},
});
