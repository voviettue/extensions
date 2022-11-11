import { defineWidget } from '../../utils/define-extension';
import { validationsField } from '../fields';
import { fontFamilyChoices, shadowChoices, borderChoices, sizeChoices, fontStyleChoices } from '../choices';
import parseJson from '../../utils/parse-json';
import { useBindData } from '../../composables/use-bind-data';
import union from 'lodash/union';

let currentData: any = null;

export default defineWidget({
	id: 'multiple-select',
	name: 'Multiple Select',
	icon: 'checklist_rtl',
	options: ({ values }) => {
		currentData = values?.options?.data;
		const bindData = useBindData(currentData);
		const data = Array.isArray(parseJson(bindData, [])) ? parseJson(bindData, []) : [];
		let dateFields: string[] = [];
		data?.map((e: {}) => {
			dateFields = union(
				dateFields,
				Object.entries(e).reduce((pre: string[], [k, v]: [string, any]) => {
					if (typeof v === 'string' || typeof v === 'number') {
						pre.push(k);
					}
					return pre;
				}, [])
			);
		});

		const defaultOptions = [
			{
				field: 'dataField',
				name: 'Data Options',
				type: 'string',
				meta: {
					interface: 'select-radio',
					width: 'full',
					options: {
						choices: [
							{ text: 'Manual', value: 'choices' },
							{ text: 'Mapped', value: 'data' },
						],
					},
				},
				schema: {
					default_value: 'choices',
				},
			},
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
					hidden: true,
					conditions: [
						{
							rule: {
								dataField: {
									_eq: 'data',
								},
							},
							hidden: false,
						},
					],
				},
			},
			{
				field: 'defaultValue',
				name: 'Default Value',
				type: 'string',
				meta: {
					interface: 'input',
					width: 'full',
					options: {
						trim: true,
						placeholder: 'Enter default value to be displayed',
					},
				},
			},
			{
				field: 'textField',
				name: 'Text',
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
					hidden: true,
					conditions: [
						{
							rule: {
								dataField: {
									_eq: 'data',
								},
							},
							hidden: false,
						},
					],
				},
			},
			{
				field: 'valueField',
				name: 'Value',
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
					hidden: true,
					conditions: [
						{
							rule: {
								dataField: {
									_eq: 'data',
								},
							},
							hidden: false,
						},
					],
				},
			},
			{
				field: 'secondaryField',
				name: 'Secondary Text',
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
					width: 'full',
					hidden: true,
					conditions: [
						{
							rule: {
								dataField: {
									_eq: 'data',
								},
							},
							hidden: false,
						},
					],
				},
			},

			{
				field: 'choices',
				name: 'Choices',
				type: 'json',
				meta: {
					interface: 'list',
					options: {
						addLable: 'Add list choices',
						template: '{{ text }}  →  {{ value}}',
						fields: [
							{
								field: 'text',
								type: 'string',
								name: 'Text',
								meta: {
									interface: 'input',
									width: 'half',
									options: {
										placeholder: 'Enter a text...',
									},
								},
							},
							{
								field: 'value',
								name: 'Value',
								type: 'string',
								meta: {
									interface: 'input',
									width: 'half',
									options: {
										placeholder: 'Enter a value...',
									},
								},
							},
							{
								field: 'secondaryText',
								name: 'Secondary Text',
								type: 'string',
								meta: {
									interface: 'input',
									width: 'full',
									options: {
										placeholder: 'Enter secondary text to be display',
									},
								},
							},
						],
					},
					hidden: true,
					conditions: [
						{
							rule: {
								dataField: {
									_eq: 'choices',
								},
							},
							hidden: false,
						},
					],
				},
			},
			{
				field: 'allowNone',
				name: 'Allow None',
				type: 'boolean',
				meta: {
					width: 'half',
					interface: 'Boolean',
				},
			},

			{
				field: 'allowOther',
				name: 'Allow Other',
				type: 'boolean',
				meta: {
					width: 'half',
					interface: 'Boolean',
				},
			},
			{
				field: 'allowSearching',
				name: 'Allow Searching',
				type: 'boolean',
				meta: {
					width: 'half',
					interface: 'Boolean',
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
					special: ['alias', 'no-data'],
				},
			},
			{
				field: 'label',
				name: 'Label',
				type: 'string',
				meta: {
					interface: 'input',
					width: 'full',
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
				field: 'alignment',
				name: 'Alignment',
				type: 'string',
				meta: {
					interface: 'select-dropdown',
					width: 'half',
					options: {
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
					hidden: true,
					conditions: [
						{
							rule: {
								labelPosition: {
									_eq: 'left',
								},
							},
							hidden: false,
						},
					],
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
					hidden: true,
					conditions: [
						{
							rule: {
								labelPosition: {
									_eq: 'left',
								},
							},
							hidden: false,
						},
					],
				},
				schema: {
					default_value: 2,
				},
			},
			{
				field: 'validation_group',
				name: 'Validation',
				type: 'alias',
				meta: {
					width: 'full',
					options: { title: 'Validation' },
					interface: 'presentation-divider',
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
			validationsField,
			{
				field: 'generalOptions',
				type: 'alias',
				meta: {
					interface: 'presentation-divider',
					options: {
						title: 'Generals',
					},
					special: ['alias', 'no-data'],
				},
			},
			{
				field: 'placeholder',
				name: 'Placeholder',
				type: 'string',
				meta: {
					interface: 'input',
					width: 'full',
					options: {
						trim: true,
						placeholder: 'Enter placeholder to be displayed',
					},
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
				field: 'icon',
				name: 'Icon',
				type: 'string',
				meta: {
					width: 'half',
					interface: 'select-icon',
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
				schema: {
					default_value: false,
				},
			},
			{
				field: 'autofocus',
				name: 'Auto Focus',
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
				field: 'eventOptions',
				type: 'alias',
				meta: {
					interface: 'presentation-divider',
					options: {
						title: 'Events',
					},
					special: ['alias', 'no-data'],
				},
			},
			{
				field: 'onChange',
				name: 'onValueChange',
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
						choices: fontStyleChoices,
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
		return defaultOptions;
	},
});
