import { defineDisplay } from '@directus/extensions-sdk';
import DisplayComponent from './display.vue';

export default defineDisplay({
	id: 'display-duration',
	name: 'Duration',
	icon: 'timer',
	description: 'Input duration display',
	component: DisplayComponent,
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
	types: ['time'],
});
