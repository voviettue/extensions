import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './src/list-key-display.vue';

export default defineInterface({
	id: 'list-key-display',
	name: 'List Key Display',
	description: 'Conditions stlye',
	icon: 'dvr',
	component: InterfaceComponent,
	types: ['json'],
	options: [],
	system: true,
});
