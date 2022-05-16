import { DeepPartial, Field } from '@directus/shared/types';
import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';

export default defineInterface({
	id: 'auto-number',
	name: 'Auto Number',
	icon: '123',
	description: 'Set format and increments a number',
	component: InterfaceComponent,
	types: ['string'],
	options: ({ field }) => {
		const options: { standard: DeepPartial<Field[]>, advanced: DeepPartial<Field[]>} = {
			standard: [
				{
					field: 'iconLeft',
					name: '$t:icon_left',
					type: 'string',
					meta: {
						width: 'half',
						interface: 'select-icon',
					},
				},
				{
					field: 'iconRight',
					name: '$t:icon_right',
					type: 'string',
					meta: {
						width: 'half',
						interface: 'select-icon',
					},
				},
				{
					field: 'prefix',
					name: '$t:prefix',
					type: 'string',
					meta: {
						width: 'half',
						interface: 'input',
					}
				},
				{
					field: 'startNumber',
					name: 'Start number',
					type: 'integer',
					meta: {
						width: 'half',
						interface: 'input',
						required: true,
					},
					schema: {
						default_value: 1
					}
				},
				{
					field: 'minNumberOfDigits',
					name: 'Minimum number of digits',
					type: 'integer',
					meta: {
						width: 'full',
						interface: 'input',
						required: true,
					},
					schema: {
						default_value: 1
					}
				},
				{
					field: 'counter',
					name: 'Counter',
					meta: {
						hidden: true,
						readonly: true,
					},
				}
			],
			advanced: [],
		}

		return options
	}
});
