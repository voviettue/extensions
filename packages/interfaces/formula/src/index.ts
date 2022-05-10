import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';

export default defineInterface({
	id: 'input-formula',
	name: 'Formula',
	icon: 'functions',
	description: 'This is formula field!',
	component: InterfaceComponent,
	group: 'standard',
	options: ({ field, collection }) => {
		const options = [
			{
				field: 'template',
				name: 'Formula Expression',
				meta: {
					interface: 'formula-display-template',
					options: {
						collectionName: collection,
					},
					width: 'full',
				},
			},
			{
				field: 'prefix',
				name: 'Prefix',
				type: 'string',
				meta: {
					width: 'half',
					interface: 'input',
					options: {
						trim: false,
					},
				},
			},
			{
				field: 'suffix',
				name: 'Suffix',
				type: 'string',
				meta: {
					width: 'half',
					interface: 'input',
					options: {
						trim: false,
					},
				},
			},
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
		]

		if (field.type && ['bigInteger', 'integer', 'float', 'decimal'].includes(field.type)) {
			const thousandsSeparatorField = {
				field: 'thousandsSeparator',
				name: 'Thousands Separator',
				type: 'string',
				meta: {
					width: 'half',
					interface: 'select-dropdown',
					options: {
						choices: [
							{ text: 'Default', value: null },
							{ text: ',', value: ',' },
							{ text: '.', value: '.' },
						],
						allowOther: true,
					},
				}
			}
			const decimalSeparatorField = {
				field: 'decimalSeparator',
				name: 'Decimal Separator',
				type: 'string',
				meta: {
					width: 'half',
					interface: 'select-dropdown',
					options: {
						choices: [
							{ text: 'Default', value: null },
							{ text: ',', value: ',' },
							{ text: '.', value: '.' },
						],
						allowOther: true,
					},
				},
			}
			options.push(thousandsSeparatorField)
			options.push(decimalSeparatorField)
		}

		return options
	},
	types: ['string', 'text', 'integer', 'bigInteger', 'float', 'decimal'],
});
