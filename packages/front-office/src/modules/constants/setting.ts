export const formFields = [
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
		},
	},
	{
		field: 'project_background',
		name: 'Project Background',
		type: 'string',
		meta: {
			interface: 'select-color',
			width: 'half',
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

export const pageFields = [
	{
		field: 'page_settings',
		name: 'Page Settings',
		type: 'alias',
		meta: {
			width: 'full',
			options: { icon: 'article', title: 'Page' },
			interface: 'presentation-divider',
			special: ['alias', 'no-data', 'group'],
		},
	},
	{
		field: 'layoutWidth',
		name: 'Layout width',
		type: 'text',
		meta: {
			interface: 'select-dropdown',
			width: 'half',
			options: {
				choices: [
					{
						value: 'fixed',
						text: 'Fixed',
					},
					{
						value: 'fluid',
						text: 'Fluid',
					},
				],
			},
		},
		schema: {
			default_value: 'fixed',
		},
	},
	{
		field: 'maxWidth',
		name: 'Max Width',
		type: 'text',
		meta: {
			width: 'half',
			interface: 'select-dropdown',
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
