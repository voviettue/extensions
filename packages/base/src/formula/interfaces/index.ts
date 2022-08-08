import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';
import fieldOptions from './components/field-options.vue';

export default defineInterface({
	id: 'input-formula',
	name: 'Formula',
	icon: 'functions',
	description: 'This is formula field!',
	component: InterfaceComponent,
	group: 'standard',
	options: fieldOptions,
	types: [
		'string',
		'text',
		'integer',
		'bigInteger',
		'float',
		'decimal',
		'date',
		'dateTime',
		'time',
		'timestamp',
		'boolean',
	],
});
