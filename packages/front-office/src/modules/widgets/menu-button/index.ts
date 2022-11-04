import { defineWidget } from '../../utils/define-extension';
import {
	buttonTypeChoices,
	buttonSizeChoices,
	buttonVariantChoices,
	positionChoices,
	shadowChoices,
	borderChoices,
} from '../choices';

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
					template: '{{ label }}',
					fields: [
						{
							field: 'label',
							name: 'Button Label',
							type: 'string',
							meta: {
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
								interface: 'select-icon',
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
							field: 'divider',
							name: 'Divider',
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
					choices: positionChoices,
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
					choices: buttonSizeChoices,
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
					choices: buttonVariantChoices,
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
					choices: buttonTypeChoices,
				},
			},
			schema: {
				default_value: 'solid',
			},
		},
		{
			field: 'disabled',
			name: 'Disabled',
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
				interface: 'select-dropdown',
				width: 'half',
				options: {
					allowOther: true,
					allowNone: true,
					choices: borderChoices,
					placeholder: 'Default',
				},
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
					choices: shadowChoices,
				},
			},
		},
	],
});
