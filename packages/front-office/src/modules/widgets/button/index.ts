import { defineWidget } from '../../utils/define-extension';
import {
	buttonVariantChoices,
	buttonTypeChoices,
	positionChoices,
	shadowChoices,
	buttonSizeChoices,
	borderChoices,
} from '../choices';
export default defineWidget({
	id: 'button',
	name: 'Button',
	icon: 'smart_button',
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
			field: 'generalOptions',
			type: 'alias',
			meta: {
				interface: 'presentation-divider',
				options: {
					title: 'General',
				},
				special: ['alias', 'no-data'],
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
			field: 'eventsOptions',
			type: 'alias',
			meta: {
				interface: 'presentation-divider',
				options: {
					title: 'Events',
				},
				special: ['alias', 'no-data'],
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
			field: 'stylesOptions',
			type: 'alias',
			meta: {
				interface: 'presentation-divider',
				options: {
					title: 'Styles',
				},
				special: ['alias', 'no-data'],
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
