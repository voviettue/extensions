import { defineWidget } from '../../utils/define-extension';
import { validationsField } from '../fields';
import { sizeChoices, fontFamilyChoices, shadowChoices, borderChoices } from '../choices';

export default defineWidget({
	id: 'textarea',
	name: 'Textarea Input',
	icon: 'article',
	options: ({ values }) => {
		const defaultOptions = [
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
				field: 'trim',
				name: 'Trim',
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
				field: 'showWorkLimit',
				name: 'Show Work Limit',
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
