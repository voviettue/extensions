import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './src/input-display-template.vue';

export default defineInterface({
	id: 'input-display-template',
	name: 'Input Display Template',
	description: 'Mix static text and dynamic field values',
	icon: 'percent',
	component: InterfaceComponent,
	types: ['text'],
	options: [],
	system: true,
});
