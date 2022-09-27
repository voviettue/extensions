import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './src/input-javascript.vue';

export default defineInterface({
	id: 'input-javascript',
	name: 'Code Javascript',
	description: 'Input code javascript for front office module',
	icon: 'percent',
	component: InterfaceComponent,
	types: ['text'],
	options: [],
	system: true,
});
