export const formFields = [
	{
		field: 'project_setup',
		name: 'Project Setup',
		type: 'alias',
		meta: {
			width: 'full',
			field: 'project_setup',
			interface: 'group-detail',
			special: ['alias', 'no-data', 'group'],
		},
	},
	{
		field: 'project_name',
		name: 'Project Name',
		type: 'string',
		meta: {
			width: 'half',
			interface: 'input',
			options: {
				trim: true,
			},
			group: 'project_setup',
		},
	},
	{
		field: 'project_background',
		name: 'Project Background',
		type: 'string',
		meta: {
			interface: 'select-color',
			width: 'half',
			group: 'project_setup',
		},
	},
	{
		collection: 'cms_settings',
		field: 'project_logo',
		name: 'Project Logo',
		type: 'uuid',
		meta: {
			width: 'full',
			interface: 'file-image',
			group: 'project_setup',
		},
	},
	{
		collection: 'cms_settings',
		field: 'homepage',
		name: 'Homepage',
		type: 'integer',
		meta: {
			width: 'full',
			interface: 'select-dropdown-m2o',
			options: {
				template: '{{name}}',
			},
			group: 'project_setup',
		},
	},
];
