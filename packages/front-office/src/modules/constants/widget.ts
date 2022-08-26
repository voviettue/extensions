export const formFields = [
	{
		field: 'name',
		name: 'Name',
		type: 'string',
		meta: {
			width: 'half',
			interface: 'input',
			required: true,
			options: {
				trim: true,
				placeholder: 'Text',
			},
		},
	},
	{
		field: 'key',
		name: 'Key',
		type: 'string',
		meta: {
			width: 'half',
			interface: 'input',
			required: true,
			unique: true,
			options: {
				trim: true,
			},
		},
	},
	{
		field: 'width',
		name: 'Width',
		type: 'string',
		meta: {
			width: 'half',
			interface: 'select-dropdown',
			options: {
				choices: [
					{
						value: 'full',
						text: 'Full Width',
					},
					{
						value: 'half',
						text: 'Half Width',
					},
					{
						value: '1',
						text: '1/6 Width',
					},
					{
						value: '2',
						text: '2/6 Width',
					},
					{
						value: '3',
						text: '3/6 Width',
					},
					{
						value: '4',
						text: '4/6 Width',
					},
					{
						value: '5',
						text: '5/6 Width',
					},
				],
			},
		},
	},
	{
		field: 'hidden',
		name: 'Hidden',
		type: 'boolean',
		meta: {
			width: 'half',
			interface: 'Boolean',
		},
	},
	{
		field: 'htmlClass',
		name: 'HTML Class',
		type: 'string',
		meta: {
			width: 'full',
			interface: 'input',
		},
	},
	{
		field: 'customCss',
		name: 'Custom CSS',
		type: 'text',
		meta: {
			interface: 'input-code',
			options: {
				language: 'css',
				lineNumber: true,
				template: '.widget {\n\tbackground: white;\n\tcolor: red;\n}',
			},
		},
	},
];
