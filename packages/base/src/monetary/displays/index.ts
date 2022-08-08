import { defineDisplay, useStores } from '@directus/extensions-sdk';
import { DisplayConfig } from '@directus/shared/types';
import DisplayComponent from './display.vue';
import currencies from './currencies.json';

export default defineDisplay({
	id: 'display-monetary',
	name: 'Monetary',
	icon: 'money',
	description: 'Display monetary',
	component: DisplayComponent,
	types: ['integer', 'bigInteger', 'float', 'decimal'],
	options: () => {
		const { useSettingsStore } = useStores();
		const settingsStore = useSettingsStore();
		const currencyCode = settingsStore.settings?.default_currency;

		const options: DisplayConfig['options'] = [
			{
				field: 'currency',
				type: 'string',
				name: 'Currency',
				meta: {
					width: 'half',
					interface: 'select-dropdown',
					options: {
						choices: currencies.map((el: any) => ({
							text: `${el.name} - ${el.code} (${el.symbol})`,
							value: el.code,
						})),
						placeholder: 'Select currency',
						allowNone: true,
					},
				},
				schema: {
					default_value: currencyCode,
				},
			},
		];

		return options;
	},
});
