import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';

export default defineInterface({
	id: 'input-duration',
	name: 'Duration',
	icon: 'timer',
	description: 'Input duration interface',
	component: InterfaceComponent,
	options: [
		{
			field: 'includeSeconds',
			name: '$t:interfaces.datetime.include_seconds',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'boolean',
			},
			schema: {
				default_value: false,
			},
		},
	],
	recommendedDisplays: ['display-duration'],
	group: 'standard',
	types: ['time'],
});
