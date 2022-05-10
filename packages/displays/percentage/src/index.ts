import { defineDisplay } from '@directus/extensions-sdk';
import DisplayComponent from './display.vue';

export default defineDisplay({
	id: 'display-percentage',
	name: 'Percentage',
	icon: 'percent',
	description: 'Display suffix % after value',
	component: DisplayComponent,
	options: null,
	types: ['integer', 'float', 'decimal'],
});
