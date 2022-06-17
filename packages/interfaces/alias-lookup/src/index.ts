import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './input-alias-lookup.vue';

export default defineInterface({
	id: 'custom',
	name: 'Custom',
	icon: 'box',
	description: 'Lookup alias',
	component: InterfaceComponent,
	options: null,
	types: ['string'],
});
