import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './input-lookup.vue';
import FieldOptions from './components/field-options.vue';

export default defineInterface({
	id: 'input-lookup',
	name: 'Lookup',
	icon: 'manage_search',
	description: 'Lookup a field on linked collection',
	component: InterfaceComponent,
	group: 'standard',
	types: [
		'string',
		'text',
		'decimal',
		'float',
		'integer',
		'bigInteger',
		'boolean',
		'date',
		'dateTime',
		'time',
		'timestamp',
		'uuid',
		'hash',
		'json',
		'csv',
		'alias',
	],
	recommendedDisplays: ['formatted-value'],
	options: FieldOptions,
});
