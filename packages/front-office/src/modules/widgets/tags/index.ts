import { defineWidget } from '../../utils/define-extension';

export default defineWidget({
	id: 'tags',
	name: 'Tags',
	icon: 'sell',
	options: [
		{
			field: 'data',
			name: 'Data',
			meta: {
				interface: 'input-multiline',
				width: 'full',
			},
		},
		{
			field: 'conditions',
			name: 'Conditions',
			type: 'json',
			meta: {
				interface: 'list',
				width: 'full',
				options: {
					addLabel: 'Add Condition',
					template: '{{operator}} {{value}}',
					fields: [
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
							field: 'textColor',
							name: 'Text Color',
							type: 'string',
							meta: {
								interface: 'select-color',
								width: 'half',
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
			field: 'delimiters',
			name: 'Delimiters',
			type: 'json',
			meta: {
				interface: 'tags',
				width: 'half',
				options: {
					allowOther: true,
					presets: [',', ';', 'space'],
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
			field: 'background',
			name: 'Background Color',
			type: 'string',
			meta: {
				interface: 'select-color',
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
	],
});
