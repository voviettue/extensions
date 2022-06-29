import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './input-duration.vue';

export default defineInterface({
	id: 'input-duration',
	name: 'Duration',
	icon: 'timer',
	description: 'Input duration interface',
	component: InterfaceComponent,
	options: [
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
			schema: {
				default_value: 'hh:mm:ss',
			},
		},
	],
	recommendedDisplays: ['display-duration'],
	group: 'standard',
	types: ['time', 'integer', 'bigInteger'],
});
