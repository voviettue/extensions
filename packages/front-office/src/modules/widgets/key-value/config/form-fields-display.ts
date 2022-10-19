export default [
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
		field: 'style',
		name: 'Style',
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
						text: 'Bottom line',
						value: 'bottom-line',
					},
					{
						text: 'Connected line',
						value: 'connected-line',
					},
					{
						text: 'Covered border',
						value: 'covered-border',
					},
				],
			},
		},
	},
	{
		field: 'borderType',
		name: 'Border type',
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
						text: 'Solid',
						value: 'solid',
					},
					{
						text: 'Dashed',
						value: 'dashed',
					},
					{
						text: 'Dotted',
						value: 'dotted',
					},
				],
			},
		},
	},
	{
		field: 'textAlignLeft',
		name: 'Text Align Left',
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
		field: 'textAlignRight',
		name: 'Text Align Right',
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
		field: 'textStyleLeft',
		name: 'Text Style Left',
		type: 'json',
		meta: {
			interface: 'select-multiple-dropdown',
			width: 'half',
			options: {
				placeholder: 'Select styles',
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
		field: 'textStyleRight',
		name: 'Text Style Right',
		type: 'json',
		meta: {
			interface: 'select-multiple-dropdown',
			width: 'half',
			options: {
				placeholder: 'Select styles',
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
		field: 'textColorLeft',
		name: 'Text Color Left',
		type: 'string',
		meta: {
			interface: 'select-color',
			width: 'half',
		},
	},
	{
		field: 'textColorRight',
		name: 'Text Color Right',
		type: 'string',
		meta: {
			interface: 'select-color',
			width: 'half',
		},
	},
];
