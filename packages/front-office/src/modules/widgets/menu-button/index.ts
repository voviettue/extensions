import { defineWidget } from '../../utils/define-extension';

export default defineWidget({
	id: 'menu-button',
	name: 'Menu Button',
	icon: 'arrow_drop_down_circle',
	options: [
		{
			field: 'label',
			name: 'Label',
			type: 'string',
			meta: {
				required: true,
				interface: 'input',
				width: 'full',
				options: {
					trim: true,
					placeholder: 'Enter label to be displayed',
				},
			},
		},
		{
			field: 'menuItems',
			name: 'Menu Items',
			type: 'json',
			meta: {
				interface: 'list',
				options: {
					addLable: 'Create New',
					template: '{{ label }} - {{ key }}',
					fields: [
						{
							field: 'label',
							name: 'Column Name',
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
							field: 'icon',
							name: 'Icon',
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
							field: 'hidden',
							name: 'Hidden',
							type: 'boolean',
							meta: {
								width: 'half',
								interface: 'boolean',
							},
						},
						{
							field: 'disabled',
							name: 'Disabled',
							type: 'boolean',
							meta: {
								width: 'half',
								interface: 'boolean',
							},
						},
						{
							field: 'onClick',
							name: 'On Click (Javascript)',
							meta: {
								width: 'full',
								interface: 'input-javascript',
								options: {
									minLine: 4,
								},
								note: 'Type "/" to see all of variables and function are supported.',
							},
						},
					],
				},
			},
		},
		{
			field: 'generalDivider',
			name: 'General',
			type: 'alias',
			meta: {
				width: 'full',
				options: { title: 'General' },
				interface: 'presentation-divider',
				special: ['alias', 'no-data', 'group'],
			},
		},
		{
			field: 'leftIcon',
			name: 'Left Icon',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'select-icon',
			},
		},
		{
			field: 'rightIcon',
			name: 'Right Icon',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'select-icon',
			},
		},
		{
			field: 'tooltip',
			name: 'Tooltip',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'full',
				options: {
					trim: true,
					placeholder: 'Enter tooltip to be displayed',
				},
			},
		},
		{
			field: 'position',
			name: 'Position',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					choices: [
						{
							text: 'Left',
							value: 'left',
						},
						{
							text: 'Center',
							value: 'center',
						},
						{
							text: 'Right',
							value: 'right',
						},
					],
				},
			},
			schema: {
				default_value: 'center',
			},
		},
		{
			field: 'buttonSize',
			name: 'Button Size',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					allowNone: true,
					choices: [
						{
							text: 'SM',
							value: 'sm',
						},
						{
							text: 'MD',
							value: 'md',
						},
						{
							text: 'LG',
							value: 'lg',
						},
					],
				},
			},
			schema: {
				default_value: 'md',
			},
		},
		{
			field: 'buttonVariant',
			name: 'Button Variant',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					allowNone: true,
					choices: [
						{
							text: 'Primary',
							value: 'primary',
						},
						{
							text: 'Secondary',
							value: 'secondary',
						},
						{
							text: 'Success',
							value: 'success',
						},
						{
							text: 'Warning',
							value: 'warning',
						},
						{
							text: 'Danger',
							value: 'danger',
						},
						{
							text: 'Info',
							value: 'info',
						},
						{
							text: 'Light',
							value: 'light',
						},
						{
							text: 'Dark',
							value: 'dark',
						},
					],
				},
			},
			schema: {
				default_value: 'primary',
			},
		},
		{
			field: 'buttonType',
			name: 'Button Type',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					allowNone: true,
					choices: [
						{
							text: 'Solid',
							value: 'solid',
						},
						{
							text: 'Outline',
							value: 'outline',
						},
						{
							text: 'Link',
							value: 'link',
						},
						{
							text: 'Ghost',
							value: 'ghost',
						},
					],
				},
			},
			schema: {
				default_value: 'solid',
			},
		},
		{
			field: 'disable',
			name: 'Disable',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'Boolean',
			},
			schema: {
				default_value: false,
			},
		},
		{
			field: 'outline',
			name: 'Outline',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'Boolean',
			},
			schema: {
				default_value: false,
			},
		},
		{
			field: 'eventsDivider',
			name: 'Events',
			type: 'alias',
			meta: {
				width: 'full',
				options: { title: 'Events' },
				interface: 'presentation-divider',
				special: ['alias', 'no-data', 'group'],
			},
		},
		{
			field: 'onClick',
			name: 'On Click (Javascript)',
			meta: {
				width: 'full',
				interface: 'input-javascript',
				options: {
					minLine: 4,
				},
				note: 'Type "/" to see all of variables and function are supported.',
			},
		},
		{
			field: 'stylesDivider',
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
			field: 'borderRadius',
			name: 'Border Radius',
			type: 'integer',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					trim: true,
					placeholder: 'Enter border width size in px',
				},
			},
			schema: {
				default_value: 0,
			},
		},
		{
			field: 'shadow',
			name: 'Box Shadow',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					allowNone: true,
					choices: [
						{
							text: 'SM',
							value: 'sm',
						},
						{
							text: 'MD',
							value: 'md',
						},
						{
							text: 'LG',
							value: 'lg',
						},
						{
							text: 'XL',
							value: 'xl',
						},
						{
							text: '2XL',
							value: '2xl',
						},
					],
				},
			},
			schema: {
				default_value: 'md',
			},
		},
	],
});
