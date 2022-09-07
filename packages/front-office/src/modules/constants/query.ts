export const formFields = [
	{
		collection: 'cms_queries',
		field: 'output',
		name: 'Output',
		type: 'json',
		meta: {
			interface: 'code',
			readonly: true,
			placeholder: 'Enter code here...',
		},
	},
	{
		collection: 'cms_queries',
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
		collection: 'cms_queries',
		field: 'timeout',
		name: 'Timeout',
		type: 'integer',
		meta: {
			width: 'half',
			interface: 'input',
			options: {
				trim: true,
			},
		},
		schema: {
			default_value: 10000,
			placeholder: 'Text',
		},
	},
	{
		collection: 'cms_queries',
		field: 'refresh_on_load',
		name: 'Refresh on load',
		type: 'boolean',
		meta: {
			width: 'half',
			interface: 'boolean',
		},
	},
];
