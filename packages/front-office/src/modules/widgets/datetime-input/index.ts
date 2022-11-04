import { defineWidget } from '../../utils/define-extension';
import { sizeChoices, fontFamilyChoices, shadowChoices, borderChoices } from '../choices';

export default defineWidget({
	id: 'datetime-input',
	name: 'Datetime Input',
	icon: 'edit_calendar',
	options: ({ values }) => {
		const validationRuleChoices = [
			{
				text: 'minute (hh:mm)',
				value: 'hh:mm',
			},
			{
				text: 'second (hh:mm:ss)',
				value: 'hh:mm:ss',
			},
		];

		const defaultOptions = [
			{
				field: 'defaultValue',
				name: 'Default Value',
				type: 'dateTime',
				meta: {
					interface: 'datetime',
					width: 'half',
					options: {
						use24: true,
						includeSeconds: true,
					},
				},
			},
			{
				field: 'timePrecision',
				name: 'Time Precision',
				type: 'string',
				meta: {
					interface: 'select-dropdown',
					width: 'half',
					options: {
						allowNone: true,
						choices: validationRuleChoices,
					},
				},
			},
			{
				field: 'labelOptions',
				type: 'alias',
				meta: {
					interface: 'presentation-divider',
					options: {
						title: 'Label',
					},
					special: ['alias', 'no-data', 'group'],
				},
			},
			{
				field: 'label',
				name: 'Label',
				type: 'string',
				meta: {
					interface: 'input',
					width: 'full',
					required: true,
					options: {
						trim: true,
						placeholder: 'Enter label to be displayed',
					},
				},
			},
			{
				field: 'labelPosition',
				name: 'Label Position',
				type: 'string',
				meta: {
					interface: 'select-dropdown',
					width: 'half',
					options: {
						allowNone: true,
						choices: [
							{
								text: 'Left',
								value: 'left',
							},
							{
								text: 'Top',
								value: 'top',
							},
						],
					},
				},
				schema: {
					default_value: 'left',
				},
			},
			{
				field: 'alignment',
				name: 'Label Alignment',
				type: 'string',
				meta: {
					interface: 'select-dropdown',
					width: 'half',
					options: {
						allowNone: true,
						choices: [
							{
								text: 'Left',
								value: 'left',
							},
							{
								text: 'Right',
								value: 'right',
							},
						],
					},
				},
				schema: {
					default_value: 'left',
				},
			},
			{
				field: 'labelWidth',
				name: 'Label Width',
				type: 'integer',
				meta: {
					interface: 'input',
					width: 'half',
					options: {
						placeholder: 'Enter label width',
						min: 1,
						max: 5,
					},
				},
				schema: {
					default_value: 2,
				},
			},
			{
				field: 'hideLabel',
				name: 'Hide Label',
				type: 'boolean',
				meta: {
					width: 'half',
					interface: 'Boolean',
				},
				schema: {
					default_value: false,
				},
			},
			{
				field: 'validationOptions',
				type: 'alias',
				meta: {
					interface: 'presentation-divider',
					options: {
						title: 'Validation',
					},
					special: ['alias', 'no-data', 'group'],
				},
			},
			{
				field: 'required',
				name: 'Required',
				type: 'boolean',
				meta: {
					width: 'half',
					interface: 'Boolean',
				},
			},
			{
				field: 'minDate',
				name: 'Min Date',
				type: 'date',
				meta: {
					interface: 'datetime',
					width: 'half',
				},
			},
			{
				field: 'maxDate',
				name: 'Max Date',
				type: 'date',
				meta: {
					interface: 'datetime',
					width: 'half',
				},
			},
			{
				field: 'validations',
				name: 'Rules',
				type: 'json',
				meta: {
					interface: 'list',
					width: 'full',
					options: {
						addLabel: 'Add Rule',
						template: '{{ rule }}: {{ value }}',
						fields: [
							{
								field: 'rule',
								name: 'Rule',
								meta: {
									interface: 'select-dropdown',
									width: 'half',
									options: {
										placeholder: 'Select a rule',
										choices: [
											{
												value: 'date_before',
												text: 'Date Before',
											},
											{
												value: 'date_after',
												text: 'Date After',
											},
										],
									},
								},
							},
							{
								field: 'value',
								name: 'Value',
								type: 'dateTime',
								meta: {
									interface: 'datetime',
									width: 'half',
									options: {
										use24: true,
										includeSeconds: true,
									},
								},
							},
							{
								field: 'errorMessage',
								name: 'Error Message',
								meta: {
									interface: 'input',
									width: 'full',
									options: {
										trim: true,
										placeholder: 'Override by default',
									},
								},
							},
						],
					},
				},
			},
			{
				field: 'generalOptions',
				type: 'alias',
				meta: {
					interface: 'presentation-divider',
					options: {
						title: 'General',
					},
					special: ['alias', 'no-data', 'group'],
				},
			},
			{
				field: 'tooltip',
				name: 'Tooltip',
				type: 'string',
				meta: {
					interface: 'input',
					width: 'full',
					options: {
						trim: true,
						placeholder: 'Enter tooltip to be displayed',
					},
				},
			},
			{
				field: 'helpText',
				name: 'Help Text',
				type: 'string',
				meta: {
					interface: 'input',
					width: 'full',
					options: {
						trim: true,
						placeholder: 'Enter helpText to be displayed',
					},
				},
			},
			{
				field: 'prefixIcon',
				name: 'Prefix Icon',
				type: 'string',
				meta: {
					width: 'half',
					interface: 'select-icon',
				},
			},
			{
				field: 'suffixIcon',
				name: 'Suffix Icon',
				type: 'string',
				meta: {
					width: 'half',
					interface: 'select-icon',
				},
			},
			{
				field: 'prefix',
				name: 'Prefix',
				type: 'string',
				meta: {
					interface: 'input',
					width: 'half',
					options: {
						trim: true,
						placeholder: 'Enter prefix to be displayed',
					},
				},
			},
			{
				field: 'suffix',
				name: 'Suffix',
				type: 'string',
				meta: {
					interface: 'input',
					width: 'half',
					options: {
						trim: true,
						placeholder: 'Enter suffix to be displayed',
					},
				},
			},
			{
				field: 'readonly',
				name: 'Readonly',
				type: 'boolean',
				meta: {
					width: 'half',
					interface: 'Boolean',
				},
			},
			{
				field: 'autoFocus',
				name: 'Autofocus',
				type: 'boolean',
				meta: {
					width: 'half',
					interface: 'Boolean',
				},
			},
			{
				field: 'eventOptions',
				type: 'alias',
				meta: {
					interface: 'presentation-divider',
					options: {
						title: 'Events',
					},
					special: ['alias', 'no-data', 'group'],
				},
			},
			{
				field: 'onChange',
				name: 'Event onChange',
				type: 'text',
				meta: {
					interface: 'input-code',
					width: 'full',
					options: {
						language: 'javascript',
						lineNumber: true,
						template: 'console.log("javascript")',
					},
				},
			},
			{
				field: 'styleOptions',
				type: 'alias',
				meta: {
					interface: 'presentation-divider',
					options: {
						title: 'Styles',
					},
					special: ['alias', 'no-data'],
				},
			},
			{
				field: 'labelColor',
				name: 'Label Color',
				type: 'string',
				meta: {
					interface: 'select-color',
					width: 'half',
				},
			},
			{
				field: 'labelFontStyle',
				name: 'Label Style',
				type: 'json',
				meta: {
					interface: 'select-multiple-dropdown',
					width: 'half',
					options: {
						choices: [
							{
								text: 'BOLD',
								value: 'bold',
							},
							{
								text: 'ITALIC',
								value: 'italic',
							},
							{
								text: 'UNDERLINE',
								value: 'underline',
							},
						],
						placeholder: 'Select',
						allowNone: true,
					},
				},
			},
			{
				field: 'labelSize',
				name: 'Label Size',
				type: 'string',
				meta: {
					interface: 'select-dropdown',
					width: 'half',
					options: {
						allowOther: true,
						allowNone: true,
						placeholder: 'Default',
						choices: sizeChoices,
					},
				},
			},
			{
				field: 'labelFontFamily',
				name: 'Label Font Family',
				type: 'string',
				meta: {
					interface: 'select-dropdown',
					width: 'half',
					options: {
						allowNone: true,
						choices: fontFamilyChoices,
						placeholder: 'Default',
					},
				},
			},
			{
				field: 'borderRadius',
				name: 'Border Radius',
				type: 'integer',
				meta: {
					interface: 'select-dropdown',
					width: 'half',
					options: {
						allowOther: true,
						allowNone: true,
						choices: borderChoices,
						placeholder: 'Default',
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
						choices: shadowChoices,
					},
				},
			},
		];
		let data = [...defaultOptions];
		if (values?.options?.labelPosition === 'top') {
			data = data.filter((item) => !['labelWidth', 'alignment'].includes(item.field));
		}

		return data;
	},
});
