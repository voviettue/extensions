import { defineWidget } from '../../utils/define-extension';

export default defineWidget({
	id: 'text-input',
	name: 'Text Input',
	icon: 'textsms',
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
				field: 'required',
				name: 'Required',
				type: 'boolean',
				meta: {
					width: 'half',
					interface: 'Boolean',
				},
			},
			{
				field: 'minLength',
				name: 'Min Length',
				type: 'integer',
				meta: {
					interface: 'input',
					width: 'half',
					options: {
						trim: true,
						placeholder: 'Enter min length character',
						min: 0,
					},
				},
			},
			{
				field: 'maxLength',
				name: 'Max Length',
				type: 'integer',
				meta: {
					interface: 'input',
					width: 'half',
					options: {
						trim: true,
						placeholder: 'Enter max length character',
						min: 0,
					},
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
				field: 'leftIcon',
				name: 'Left Icon',
				type: 'string',
				meta: {
					width: 'half',
					interface: 'select-icon',
				},
			},
			{
				field: 'rightIcon',
				name: 'Right Icon',
				type: 'string',
				meta: {
					width: 'half',
					interface: 'select-icon',
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
			},
			{
				field: 'marked',
				name: 'Marked',
				type: 'boolean',
				meta: {
					width: 'half',
					interface: 'Boolean',
				},
			},
			{
				field: 'disable',
				name: 'Disable',
				type: 'boolean',
				meta: {
					width: 'half',
					interface: 'Boolean',
				},
			},
			{
				field: 'regex',
				name: 'Regex',
				type: 'text',
				meta: {
					interface: 'input-code',
					width: 'full',
					options: {
						language: 'javascript',
						lineNumber: true,
						template: '^[A-Za-z0-9]+$',
					},
				},
			},
			{
				field: 'errorMessage',
				name: 'Error message',
				type: 'string',
				meta: {
					interface: 'input',
					width: 'full',
					options: {
						trim: true,
						placeholder: 'Enter error message to be displayed',
					},
				},
			},
			{
				field: 'reset',
				name: 'Reset On Submit',
				type: 'boolean',
				meta: {
					width: 'half',
					interface: 'Boolean',
				},
			},
			{
				field: 'autoFocus',
				name: 'Auto Focus',
				type: 'boolean',
				meta: {
					width: 'half',
					interface: 'Boolean',
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
				field: 'alignment',
				name: 'Alignment',
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
				field: 'labelSize',
				name: 'Label Size',
				type: 'string',
				meta: {
					interface: 'select-dropdown',
					width: 'half',
					options: {
						allowOther: true,
						allowNone: true,
						choices: [
							{
								text: 'XS - 0.75rem',
								value: '0.75rem',
							},
							{
								text: 'SM - 0.875rem',
								value: '0.875rem',
							},
							{
								text: 'LG - 1.125rem',
								value: '1.125rem',
							},
							{
								text: 'XL - 1.25rem',
								value: '1.25rem',
							},
							{
								text: '2XL - 1.5rem',
								value: '1.5rem',
							},
							{
								text: '3XL - 1.875rem',
								value: '1.875rem',
							},
						],
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
						choices: [
							{
								text: 'Arial',
								value: 'Arial',
							},
							{
								text: 'Cambria',
								value: 'Cambria',
							},
							{
								text: 'Courier New',
								value: 'Courier New',
							},
							{
								text: 'Lato',
								value: 'Lato',
							},
							{
								text: 'Nato Sans',
								value: 'Nato Sans',
							},
							{
								text: 'Roboto',
								value: 'Roboto',
							},
							{
								text: 'Monaco',
								value: 'Monaco',
							},
						],
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
				schema: {
					default_value: 0,
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
				schema: {
					default_value: 'md',
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
		];
		let data = [...defaultOptions];
		if (values?.options?.labelPosition === 'top') {
			data = data.filter((item) => item.field !== 'labelWidth');
		}
		return data;
	},
});
