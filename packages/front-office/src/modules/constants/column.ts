export const formFields = [
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
				placeholder: 'Key',
			},
		},
	},
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
				placeholder: 'Name',
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
		defaultValue: false,
	},
];
