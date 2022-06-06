import { DeepPartial, Field } from '@directus/shared/types';
import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';

export default defineInterface({
	id: 'auto-number',
	name: 'Auto Number',
	icon: '123',
	description: 'A system-generated sequence number',
	component: InterfaceComponent,
	types: ['string'],
	group: 'standard',
	recommendedDisplays: ['formatted-value'],
	options: () => {
		const options: { standard: DeepPartial<Field[]>; advanced: DeepPartial<Field[]> } = {
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
						note: 'The prefix supports date parameters like [YYYY], [MM], [DD]',
					},
				},
				{
					field: 'startNumber',
					name: 'Start number',
					type: 'integer',
					meta: {
						width: 'half',
						interface: 'input',
						required: true,
						options: {
							min: 1,
						},
					},
					schema: {
						default_value: 1,
					},
				},
				{
					field: 'minNumberOfDigits',
					name: 'Minimum number of digits',
					type: 'integer',
					meta: {
						width: 'full',
						interface: 'input',
						required: true,
						options: {
							min: 1,
						},
					},
					schema: {
						default_value: 1,
					},
				},
			],
			advanced: [],
		};

		return options;
	},
});
