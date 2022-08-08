import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './input-alias-lookup.vue';
import FieldOptions from './components/field-options.vue';

export default defineInterface({
	id: 'input-lookup-alias',
	name: 'Lookup Alias',
	icon: 'manage_search',
	description: 'Lookup a field is a relation alias (O2M, M2M)',
	component: InterfaceComponent,
	group: 'standard',
	types: ['alias'],
	options: FieldOptions,
});
