import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';

export default defineInterface({
	id: 'interface-hook-schedule',
	name: 'Hook schedule',
	icon: 'anchor',
	description: 'Running your custom code at schedule times',
	component: InterfaceComponent,
	group: 'other',
	types: ['string'],
	options: () => {
		return [
			{
				field: 'expression',
				name: 'Schedule expression',
				meta: {
					interface: 'input',
					width: 'full',
					note: '<a style="color: #00c897 !important" href="https://crontab.guru/" target="_blank">Config your schedule</a>',
				},
			},
			{
				field: 'startDate',
				name: 'Start Date',
				meta: {
					interface: 'datetime',
					width: 'half',
				},
				type: 'date',
			},
			{
				field: 'endDate',
				name: 'End Date',
				meta: {
					interface: 'datetime',
					width: 'half',
				},
				type: 'date',
			},
			{
				field: 'isActive',
				name: 'Active',
				meta: {
					interface: 'boolean',
					width: 'half',
				},
			},
			{
				field: 'code',
				name: 'Code',
				type: 'string',
				meta: {
					interface: 'input-multiline',
					width: 'full',
					options: {
						placeholder:
							'Available parameters: ' +
							'\n' +
							'• services — All API internal services' +
							'\n' +
							'• exceptions — API exception objects that can be used for throwing "proper" errors' +
							'\n' +
							'• database — Knex instance that is connected to the current database' +
							'\n' +
							'• getSchema — Async function that reads the full available schema for use in services' +
							'\n' +
							'• env — Parsed environment variables' +
							'\n' +
							'• logger — Pino(opens new window)instance.' +
							'\n' +
							'• emitter — Event emitter(opens new window)instance that can be used to trigger custom events for other extensions.',
					},
				},
			},
		];
	},
});
