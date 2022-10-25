import { defineWidget } from '../../utils/define-extension';

export default defineWidget({
	id: 'select',
	name: 'Select',
	icon: 'segment',
	options: ({ values }) => {
		const defaultOptions = [
			{
				field: 'choicesOptions',
				type: 'alias',
				meta: {
					interface: 'presentation-divider',
					options: {
						title: 'Choices Options',
					},
					special: ['alias', 'no-data'],
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
								name: 'Key',
								meta: {
									interface: 'input',
									width: 'half',
									options: {
										placeholder: 'Key',
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
										placeholder: 'Value',
									},
								},
							},
						],
					},
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
				field: 'required',
				name: 'Required',
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
				field: 'Style',
				type: 'alias',
				meta: {
					interface: 'presentation-divider',
					options: {
						title: 'Style',
					},
					special: ['alias', 'no-data'],
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
				field: 'labelSetting',
				type: 'alias',
				meta: {
					interface: 'presentation-divider',
					options: {
						title: 'Label Setting',
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
					required: true,
					options: {
						trim: true,
						placeholder: 'Enter label to be displayed',
					},
				},
			},
			{
				field: 'labelPosition',
				name: 'Position',
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
			},
			{
				field: 'labelColor',
				name: 'Color',
				type: 'string',
				meta: {
					interface: 'select-color',
					width: 'half',
				},
			},
			{
				field: 'labelSize',
				name: 'Size',
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
				name: 'Font Family',
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
								text: 'Noto Sans',
								value: 'Noto Sans',
							},
							{
								text: 'Roboto',
								value: 'Roboto',
							},
							{
								text: 'Monaco',
								value: 'Monaco',
							},
							{
								text: 'Inter',
								value: 'Inter',
							},
						],
					},
				},
			},
			{
				field: 'labelWidth',
				name: 'Width',
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
				field: 'eventOptions',
				type: 'alias',
				meta: {
					interface: 'presentation-divider',
					options: {
						title: 'Event Options',
					},
					special: ['alias', 'no-data'],
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
			data = data.filter((item) => !['labelWidth', 'alignment'].includes(item.field));
		}
		return data;
	},
});
