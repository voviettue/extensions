import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';

export default defineInterface({
	id: 'interface-embed-code',
	name: 'Embed Code',
	icon: 'code',
	description: 'You can running your code after form is loaded',
	component: InterfaceComponent,
	hideLabel: true,
	hideLoader: true,
	group: 'other',
	types: ['alias'],
	options: ({ field }) => {
		field['meta']['special'] = ['alias', 'no-data'];

		return [
			{
				field: 'code',
				name: 'Code',
				type: 'string',
				meta: {
					interface: 'input-multiline',
					width: 'full',
					options: {
						placeholder:
							'Support 4 arguments \n' +
							'1. setValue(name, value): set value of other field \n' +
							'2. getValue(name, value): get value of other field \n' +
							'3. currentUser \n' +
							'4. api: axios instance \n' +
							'5. stores \n',
					},
				},
			},
			{
				field: 'triggerOnCreate',
				type: 'boolean',
				name: 'Trigger on Create',
				schema: {
					default_value: true,
				},
				meta: {
					width: 'half',
					interface: 'boolean',
				},
				defaultValue: true,
			},
			{
				field: 'triggerOnUpdate',
				type: 'boolean',
				name: 'Trigger on Update',
				schema: {
					default_value: false,
				},
				meta: {
					width: 'half',
					interface: 'boolean',
				},
			},
		];
	},
});
