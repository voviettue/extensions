import { defineWidget } from '../../utils/define-extension';
import { Field } from '@directus/shared/types';
import format from 'date-fns/format';
import parseJson from '../../utils/parse-json';
import { useBindData } from '../../composables/use-bind-data';
import pickBy from 'lodash/pickBy';
import union from 'lodash/union';
import parseDate from '../../utils/parse-date';

let currentData: any = null;

export default defineWidget({
	id: 'calendar',
	name: 'Calendar',
	icon: 'calendar_month',
	options: ({ values }) => {
		// const frontOfficeStore = useFrontOfficeStore();
		// const { queries } = storeToRefs(frontOfficeStore);

		// const $query: Record<string, any> = {};
		// queries.value.forEach((query: any) => {
		// 	$query[query.key] = isJson(query.output) ? JSON.parse(query.output) : query.output;
		// });

		// if (currentData !== values?.options?.data) {
		// }

		currentData = values?.options?.data;
		const bindData = useBindData(currentData);
		const data = parseJson(bindData, []);
		const object = data?.[0] ?? {};
		const fields = Object.keys(object).map(
			(key: string) =>
				({
					field: key,
					name: key,
					type: 'string',
					collection: '',
					meta: null,
					schema: null,
				} as Field)
		);

		let dateFields: string[] = [];
		data?.map((e: {}) => {
			dateFields = union(dateFields, Object.keys(pickBy(e, (value: any) => !!parseDate(value))));
		});

		const options = [
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
				field: 'displayTemplate',
				name: 'Display template',
				meta: {
					interface: 'input-display-template',
					options: {
						fields: fields,
					},
				},
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
				name: 'Start Date Field',
				type: 'string',
				meta: {
					interface: 'select-dropdown',
					options: {
						choices: dateFields?.map((field) => ({
							text: field,
							value: field,
						})),
						allowNone: true,
						allowOther: true,
					},
					width: 'half',
				},
			},
			{
				field: 'endDateField',
				name: 'End Date Field',
				type: 'string',
				meta: {
					interface: 'select-dropdown',
					options: {
						choices: dateFields?.map((field) => ({
							text: field,
							value: field,
						})),
						allowNone: true,
						allowOther: true,
					},
					width: 'half',
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
		];

		return options;
	},
});
