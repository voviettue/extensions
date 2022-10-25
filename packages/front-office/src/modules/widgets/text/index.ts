import { defineWidget } from '../../utils/define-extension';

export default defineWidget({
	id: 'text',
	name: 'Text',
	icon: 'text_fields',
	options: [
		{
			field: 'text',
			name: 'Text',
			type: 'string',
			meta: {
				required: true,
				interface: 'input',
				width: 'full',
				options: {
					trim: true,
					placeholder: 'Enter text to be displayed',
				},
			},
		},
		{
			field: 'condition',
			name: 'Condition Style',
			type: 'json',
			meta: {
				interface: 'list',
				width: 'full',
				options: {
					addLabel: 'Add Condition',
					template: 'Name: {{ name }}',
					fields: [
						{
							field: 'name',
							name: 'Name',
							meta: {
								interface: 'input',
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
							name: 'Text',
							type: 'string',
							meta: {
								interface: 'input',
								width: 'half',
								options: {
									trim: true,
									placeholder: 'Enter text to be displayed',
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
							field: 'textAlign',
							name: 'Text Align',
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
											text: 'Left',
											value: 'left',
										},
										{
											text: 'Right',
											value: 'right',
										},
										{
											text: 'Center',
											value: 'center',
										},
										{
											text: 'Justify',
											value: 'justify',
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
									allowNone: true,
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
									allowNone: true,
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
										{
											text: 'Inter',
											value: 'Inter',
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
							field: 'borderColor',
							name: 'Border Color',
							type: 'string',
							meta: {
								interface: 'select-color',
								width: 'half',
							},
						},
						{
							field: 'borderWidth',
							name: 'Border Width',
							type: 'number',
							meta: {
								interface: 'input',
								width: 'half',
								options: {
									trim: true,
									placeholder: 'Enter border width size in px',
								},
							},
						},
					],
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
			field: 'textAlign',
			name: 'Text Align',
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
							text: 'Left',
							value: 'left',
						},
						{
							text: 'Right',
							value: 'right',
						},
						{
							text: 'Center',
							value: 'center',
						},
						{
							text: 'Justify',
							value: 'justify',
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
					allowNone: true,
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
					allowNone: true,
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
						{
							text: 'Inter',
							value: 'Inter',
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
			field: 'borderColor',
			name: 'Border Color',
			type: 'string',
			meta: {
				interface: 'select-color',
				width: 'half',
			},
		},
		{
			field: 'borderWidth',
			name: 'Border Width',
			type: 'number',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					trim: true,
					placeholder: 'Enter border width size in px',
				},
			},
		},
	],
});
