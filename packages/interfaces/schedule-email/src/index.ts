import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';

export default defineInterface({
	id: 'interface-schedule-email',
	name: 'Schedule email',
	icon: 'email',
	description: 'Setting your schedule to send email',
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
				field: 'emailTo',
				name: 'Send to',
				meta: {
					interface: 'tags',
					width: 'full',
					options: {
						placeholder: 'Add email',
					},
				},
			},
			{
				field: 'emailCC',
				name: 'CC',
				meta: {
					interface: 'tags',
					width: 'full',
					options: {
						placeholder: 'Add email',
					},
				},
			},
			{
				field: 'emailBCC',
				name: 'BCC',
				meta: {
					interface: 'tags',
					width: 'full',
					options: {
						placeholder: 'Add email',
					},
				},
			},
			{
				field: 'emailSubject',
				name: 'Subject',
				meta: {
					interface: 'input',
					width: 'full',
				},
			},
			{
				field: 'emailBody',
				name: 'Body',
				meta: {
					interface: 'input-rich-text-html',
					width: 'full',
				},
			},
		];
	},
});
