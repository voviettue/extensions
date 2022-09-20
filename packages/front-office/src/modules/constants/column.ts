export const formFields = [
	{
		field: 'label',
		name: 'Column Name',
		type: 'string',
		meta: {
			width: 'half',
			interface: 'input',
			required: true,
			options: {
				trim: true,
			},
		},
	},
	{
		field: 'key',
		name: 'Column Key',
		type: 'string',
		meta: {
			width: 'half',
			interface: 'input',
			required: true,
			options: {
				trim: true,
			},
		},
	},
	{
		field: 'mappedValue',
		name: 'Mapped Value',
		type: 'string',
		meta: {
			width: 'half',
			interface: 'input',
			required: true,
			options: {
				trim: true,
			},
		},
	},
	{
		field: 'tooltip',
		name: 'Tooltip',
		type: 'string',
		meta: {
			width: 'half',
			interface: 'input',
			options: {
				trim: true,
			},
		},
	},
	{
		field: 'hidden',
		name: 'Hidden',
		type: 'boolean',
		meta: {
			width: 'half',
			interface: 'boolean',
		},
	},
	{
		field: 'verticalAlignment',
		name: 'Vertical Alignment',
		type: 'string',
		meta: {
			interface: 'select-dropdown',
			width: 'half',
			options: {
				choices: [
					{
						text: 'Top',
						value: 'top',
					},
					{
						text: 'Middle',
						value: 'middle',
					},
					{
						text: 'Bottom',
						value: 'bottom',
					},
				],
				placeholder: 'Select',
				allowNone: true,
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
];
