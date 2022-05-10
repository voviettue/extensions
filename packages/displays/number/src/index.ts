import { defineDisplay } from '@directus/extensions-sdk';
import DisplayComponent from './display.vue';

export default defineDisplay({
	id: 'display-number',
	name: 'Number',
	icon: '123',
	description: 'Display a formatted of the number',
	component: DisplayComponent,
	options: [
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
			},
		},
		{
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
		},
	],
	types: ['integer', 'bigInteger', 'decimal', 'float'],
});
