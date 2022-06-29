import { defineDisplay } from '@directus/extensions-sdk';
import DisplayComponent from './display-duration.vue';

export default defineDisplay({
	id: 'display-duration',
	name: 'Duration',
	icon: 'timer',
	description: 'Input duration display',
	component: DisplayComponent,
	options: [
		{
			field: 'format',
			name: 'Format',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					choices: [
						{
							text: 'hh:mm:ss',
							value: 'hh:mm:ss',
						},
						{
							text: 'hh:mm',
							value: 'hh:mm',
						},
						{
							text: 'mm:ss',
							value: 'mm:ss',
						},
					],
					allowOther: false,
				},
			},
		},
	],
	types: ['time', 'integer', 'bigInteger'],
});
