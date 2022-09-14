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
