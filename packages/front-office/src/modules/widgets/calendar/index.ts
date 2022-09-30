import { defineWidget } from '../../utils/define-extension';

export default defineWidget({
	id: 'calendar',
	name: 'Calendar',
	icon: 'calendar_month',
	options: [
		// {
		// 	field: 'visible',
		// 	name: 'Visible',
		// 	type: 'boolean',
		// 	meta: {
		// 		width: 'half',
		// 		interface: 'boolean',
		// 	},
		// 	schema: {
		// 		default_value: 'false',
		// 	},
		// },
		{
			field: 'data',
			name: 'Data source',
			meta: {
				interface: 'input-code',
				required: true,
				placeholder: 'Enter code here...',
				options: {
					language: 'javascript',
					lineNumber: true,
				},
			},
		},
		{
			field: 'defaultDate',
			name: 'Default date',
			meta: {
				interface: 'datetime',
				width: 'half',
			},
			type: 'date',
		},
		{
			field: 'defaultView',
			name: 'Default View',
			type: 'string',
			schema: {
				default_value: 'dayGridMonth',
			},
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					choices: [
						{
							text: 'Day View',
							value: 'timeGridDay',
						},
						{
							text: 'Week view',
							value: 'timeGridWeek',
						},
						{
							text: 'Month view',
							value: 'dayGridMonth',
						},
						{
							text: 'Year View',
							value: 'timeGridYear',
						},
					],
				},
			},
		},
		{
			field: 'displayTemplate',
			name: 'Display template',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					trim: true,
					placeholder: 'Ex: id,name,key',
				},
			},
		},
		{
			field: 'firstDay',
			name: 'First Day of Week',
			type: 'number',
			schema: {
				default_value: 0,
			},
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					choices: [
						{
							text: 'Sunday',
							value: 0,
						},
						{
							text: 'Monday',
							value: 1,
						},
						{
							text: 'Tuesday',
							value: 2,
						},
						{
							text: 'Wednesday',
							value: 3,
						},
						{
							text: 'Thursday',
							value: 4,
						},
						{
							text: 'Friday',
							value: 5,
						},
						{
							text: 'Saturday',
							value: 6,
						},
					],
				},
			},
		},
		{
			field: 'startDateField',
			name: 'Start Date',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					trim: true,
					placeholder: 'Enter value...',
				},
			},
		},
		{
			field: 'endDateField',
			name: 'End Date',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					trim: true,
					placeholder: 'Enter value...',
				},
			},
		},
		{
			field: 'borderRadius',
			name: 'Border Radius',
			type: 'integer',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					trim: true,
					placeholder: 'Enter border width size in px',
				},
			},
		},
		{
			field: 'shadow',
			name: 'Box Shadow',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					allowNone: true,
					choices: [
						{
							text: 'SM',
							value: 'sm',
						},
						{
							text: 'MD',
							value: 'md',
						},
						{
							text: 'LG',
							value: 'lg',
						},
						{
							text: 'XL',
							value: 'xl',
						},
						{
							text: '2XL',
							value: '2xl',
						},
					],
				},
			},
		},
		{
			field: 'onDateClick',
			name: 'On Date Click (Javascript)',
			meta: {
				width: 'full',
				interface: 'input-javascript',
				options: {
					minLine: 4,
				},
				note: 'Type "/" to see all of variables and function are supported.',
			},
		},
		{
			field: 'onItemClick',
			name: 'On Item Click (Javascript)',
			meta: {
				width: 'full',
				interface: 'input-javascript',
				options: {
					minLine: 4,
				},
				note: 'Type "/" to see all of variables and function are supported.',
			},
		},
	],
});
