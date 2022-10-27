import { defineWidget } from '../../utils/define-extension';

export default defineWidget({
	id: 'tags',
	name: 'Tags',
	icon: 'sell',
	options: [
		{
			field: 'data',
			name: 'Tags',
			meta: {
				interface: 'input-multiline',
				width: 'full',
			},
		},
		{
			field: 'delimiter',
			name: 'Delimiter',
			type: 'string',
			schema: {
				default_value: ',',
			},
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					allowOther: true,
					choices: [
						{
							text: 'Comma',
							value: ',',
						},
						{
							text: 'Semicolon',
							value: ';',
						},
						{
							text: 'Space',
							value: ' ',
						},
					],
				},
			},
		},
		{
			field: 'allowWrap',
			name: 'Allow Wrap',
			type: 'boolean',
			meta: {
				interface: 'boolean',
				width: 'half',
			},
		},
		{
			field: 'stylesDivider',
			type: 'alias',
			meta: {
				interface: 'presentation-divider',
				options: { title: 'Styles' },
				special: ['alias', 'no-data', 'group'],
			},
		},
		{
			field: 'conditions',
			name: 'Condition Style',
			type: 'json',
			meta: {
				interface: 'list',
				width: 'full',
				options: {
					addLabel: 'Add Condition',
					template: '{{ name }}',
					fields: [
						{
							field: 'name',
							name: 'Name',
							meta: {
								interface: 'input',
								width: 'half',
								options: {
									trim: true,
									placeholder: 'Enter a value...',
								},
							},
						},
						{
							field: 'operator',
							name: 'Operator',
							type: 'string',
							schema: {
								default_value: 'eq',
							},
							meta: {
								interface: 'select-dropdown',
								width: 'half',
								options: {
									allowNone: true,
									choices: [
										{
											text: 'Default',
											value: null,
										},
										{
											text: `$t:operators.eq`,
											value: 'eq',
										},
										{
											text: `$t:operators.neq`,
											value: 'neq',
										},
										{
											text: `$t:operators.contains`,
											value: 'contains',
										},
										{
											text: `$t:operators.starts_with`,
											value: 'starts_with',
										},
										{
											text: `$t:operators.gt`,
											value: 'gt',
										},
										{
											text: `$t:operators.gte`,
											value: 'gte',
										},
										{
											text: `$t:operators.lt`,
											value: 'lt',
										},
										{
											text: `$t:operators.lte`,
											value: 'lte',
										},
									],
								},
							},
						},
						{
							field: 'value',
							name: 'Value',
							meta: {
								interface: 'input',
								width: 'half',
								options: {
									trim: true,
									placeholder: 'Enter a value...',
								},
							},
						},
						{
							field: 'text',
							name: 'Display Text',
							type: 'string',
							meta: {
								interface: 'input',
								width: 'half',
								options: {
									trim: true,
									placeholder: 'Enter Text to be displayed',
								},
							},
						},
						{
							field: 'textTransform',
							name: 'Text Transformation',
							type: 'string',
							meta: {
								interface: 'select-dropdown',
								width: 'half',
								options: {
									allowNone: true,
									choices: [
										{
											text: 'Default',
											value: null,
										},
										{
											text: 'Uppercase',
											value: 'uppercase',
										},
										{
											text: 'Lowercase',
											value: 'lowercase',
										},
										{
											text: 'Capitalize',
											value: 'capitalize',
										},
									],
								},
							},
						},
						{
							field: 'textSize',
							name: 'Text Size',
							type: 'string',
							meta: {
								interface: 'select-dropdown',
								width: 'half',
								options: {
									allowOther: true,
									allowNone: true,
									choices: [
										{
											text: 'Default',
											value: null,
										},
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
							field: 'textColor',
							name: 'Text Color',
							type: 'string',
							meta: {
								interface: 'select-color',
								width: 'half',
							},
						},
						{
							field: 'fontFamily',
							name: 'Font Family',
							type: 'string',
							meta: {
								interface: 'select-dropdown',
								width: 'half',
								options: {
									choices: [
										{
											text: 'Default',
											value: null,
										},
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
							field: 'textStyle',
							name: 'Text Style',
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
							field: 'background',
							name: 'Background',
							type: 'string',
							meta: {
								interface: 'select-color',
								width: 'half',
							},
						},
					],
				},
			},
		},
		{
			field: 'background',
			name: 'Background Color',
			type: 'string',
			meta: {
				interface: 'select-color',
				width: 'half',
			},
		},
		{
			field: 'textColor',
			name: 'Text Color',
			type: 'string',
			meta: {
				interface: 'select-color',
				width: 'half',
			},
		},
		{
			field: 'textSize',
			name: 'Text Size',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					allowOther: true,
					allowNone: true,
					choices: [
						{
							text: 'Default',
							value: null,
						},
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
			field: 'fontFamily',
			name: 'Font Family',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					choices: [
						{
							text: 'Default',
							value: null,
						},
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
			schema: {
				default_value: 'md',
			},
		},
	],
});
