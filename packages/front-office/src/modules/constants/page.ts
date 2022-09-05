export const formFields = [
	{
		field: 'page_setup',
		name: 'Page Setup',
		type: 'alias',
		meta: {
			width: 'full',
			field: 'page_setup',
			interface: 'group-detail',
			special: ['alias', 'no-data', 'group'],
		},
	},
	{
		field: 'title',
		name: 'Title',
		type: 'string',
		meta: {
			width: 'half',
			interface: 'input',
			required: true,
			options: {
				trim: true,
			},
			group: 'page_setup',
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
			options: {
				trim: true,
			},
			group: 'page_setup',
		},
	},
	{
		field: 'endpoint',
		name: 'Endpoint',
		type: 'string',
		meta: {
			width: 'half',
			interface: 'input',
			required: true,
			unique: true,
			options: {
				trim: true,
			},
			group: 'page_setup',
		},
	},
	{
		field: 'hidden',
		name: 'Hidden',
		type: 'boolean',
		meta: {
			width: 'half',
			interface: 'boolean',
			group: 'page_setup',
		},
	},
];
