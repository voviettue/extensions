import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';
import currencies from './currencies.json';

export default defineInterface({
	id: 'select-currency',
	name: 'Currency',
	icon: 'monetization_on',
	description: 'Select a currency from a dropdown',
	component: InterfaceComponent,
	types: ['string', 'text'],
	group: 'standard',
	recommendedDisplays: ['formatted-value'],
	options: [
		{
			field: 'preferred',
			type: 'json',
			name: 'Preferred currencies',
			meta: {
				width: 'half',
				interface: 'select-multiple-dropdown',
				options: {
					choices: currencies.map((el: any) => ({
						text: `${el.name} - ${el.code} (${el.symbol})`,
						value: el.code,
					})),
					placeholder: 'Select preferred currencies',
					allowNone: true,
				},
			},
		},
	],
});
