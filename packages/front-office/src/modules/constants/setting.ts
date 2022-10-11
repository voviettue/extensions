export const formFields = [
	// {
	// 	field: 'project_setup',
	// 	name: 'Project Setup',
	// 	type: 'alias',
	// 	meta: {
	// 		width: 'full',
	// 		field: 'project_setup',
	// 		interface: 'group-detail',
	// 		special: ['alias', 'no-data', 'group'],
	// 	},
	// },
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
			// group: 'project_setup',
		},
	},
	{
		field: 'project_background',
		name: 'Project Background',
		type: 'string',
		meta: {
			interface: 'select-color',
			width: 'half',
			// group: 'project_setup',
		},
	},
	{
		collection: 'cms_settings',
		field: 'project_logo',
		name: 'Project Logo',
		type: 'uuid',
		meta: {
			width: 'half',
			interface: 'file-image',
			// group: 'project_setup',
		},
	},
	{
		collection: 'cms_settings',
		field: 'homepage',
		name: 'Homepage',
		type: 'integer',
		meta: {
			width: 'half',
			interface: 'select-dropdown-m2o',
			options: {
				template: '{{ title }}',
			},
			// group: 'project_setup',
		},
	},
];

export const menuFields = [
	{
		field: 'menu_setting',
		name: 'Menu',
		type: 'alias',
		meta: {
			width: 'full',
			options: { icon: 'menu', title: 'Menu' },
			interface: 'presentation-divider',
			special: ['alias', 'no-data', 'group'],
		},
	},
	{
		field: 'alignment',
		name: 'Alignment',
		type: 'string',
		meta: {
			interface: 'select-dropdown',
			width: 'half',
			options: {
				choices: [
					{
						value: 'left',
						text: 'Left',
					},
					{
						value: 'center',
						text: 'Center',
					},
					{
						value: 'right',
						text: 'Right',
					},
				],
			},
		},
		schema: {
			default_value: 'left',
		},
	},
	{
		field: 'hideLabel',
		name: 'Hide Label',
		type: 'boolean',
		meta: {
			width: 'half',
			interface: 'boolean',
		},
		schema: {
			default_value: false,
		},
		note: 'Only show icon',
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
];

export const optionsFields = [
	{
		field: 'other_settings',
		name: 'Other Settings',
		type: 'alias',
		meta: {
			width: 'full',
			options: { title: 'Other' },
			interface: 'presentation-divider',
			special: ['alias', 'no-data', 'group'],
		},
	},
	{
		field: 'custom_css',
		name: 'Custom CSS',
		type: 'text',
		meta: {
			interface: 'input-code',
			options: {
				language: 'css',
				lineNumber: true,
				template: 'body {\n\tbackground: lightgray;\n}',
			},
		},
	},
];
