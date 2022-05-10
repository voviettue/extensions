import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './input-percentage.vue';

export default defineInterface({
	id: 'input-percentage',
	name: 'Percentage',
	description: 'Value along with percent symbol',
	icon: 'percent',
	component: InterfaceComponent,
	types: ['decimal', 'float'],
	group: 'standard',
	options: [
		{
			field: 'min',
			name: '$t:interfaces.input.minimum_value',
			type: 'integer',
			meta: {
				width: 'half',
				interface: 'input',
			},
		},
		{
			field: 'max',
			name: '$t:interfaces.input.maximum_value',
			type: 'integer',
			meta: {
				width: 'half',
				interface: 'input',
			},
		},
		{
			field: 'step',
			name: '$t:interfaces.input.step_interval',
			type: 'integer',
			meta: {
				width: 'half',
				interface: 'input',
			},
			schema: {
				default_value: 1,
			},
		},
	],
});
