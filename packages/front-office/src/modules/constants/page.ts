export const formFields = [
	{
		field: 'page_setup',
		name: 'Page Setup',
		type: 'alias',
		meta: {
			width: 'full',
			options: { icon: 'settings', title: 'Page Setup' },
			interface: 'presentation-divider',
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
];

export const optionsFields = [
	{
		field: 'styles',
		name: 'Styles',
		type: 'alias',
		meta: {
			width: 'full',
			options: { title: 'Styles' },
			interface: 'presentation-divider',
			special: ['alias', 'no-data', 'group'],
		},
	},
	{
		field: 'maxWidth',
		name: 'Max Width',
		type: 'text',
		meta: {
			width: 'half',
			interface: 'select-dropdown',
			allowNone: true,
			allowOther: true,
			placeholder: 'Default',
			options: {
				allowNone: true,
				allowOther: true,
				placeholder: 'Default',
				choices: [
					{
						value: '1280px',
						text: '1280px',
					},
					{
						value: '1366px',
						text: '1366px',
					},
					{
						value: '1440px',
						text: '1440px',
					},
					{
						value: '1536px',
						text: '1536px',
					},
					{
						value: '1600px',
						text: '1600px',
					},
					{
						value: '1792px',
						text: '1792px',
					},
					{
						value: '1920px',
						text: '1920px',
					},
					{
						value: '2560px',
						text: '2560px',
					},
				],
			},
		},
	},
];
