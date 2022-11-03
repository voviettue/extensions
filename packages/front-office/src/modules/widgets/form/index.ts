import { defineWidget } from '../../utils/define-extension';
import { shadowChoices, borderChoices, buttonVariantChoices, buttonTypeChoices } from '../choices';

export default defineWidget({
	id: 'form',
	name: 'Form',
	icon: 'article',
	group: true,
	options: [
		{
			field: 'defaultValue',
			name: 'Default Value',
			type: 'string',
			meta: {
				interface: 'input-code',
				width: 'full',
				options: {
					trim: true,
					placeholder: 'Enter default value to be displayed',
					template: '{ "name": "App" }',
				},
			},
		},
		{
			field: 'submitGroups',
			type: 'alias',
			meta: {
				interface: 'presentation-divider',
				options: {
					title: 'Submit Button',
				},
				special: ['alias', 'no-data', 'group'],
			},
		},
		{
			field: 'hideSubmit',
			name: 'Hidden',
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
			field: 'submitLabel',
			name: 'Label',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					trim: true,
					placeholder: 'Submit',
				},
			},
		},
		{
			field: 'submitType',
			name: 'Type',
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
			field: 'submitVariant',
			name: 'Variant',
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
			field: 'onSubmit',
			name: 'on Click (Javascript)',
			type: 'text',
			meta: {
				width: 'full',
				interface: 'input-javascript',
				options: {
					minLine: 4,
					context: { $value: {} },
				},
				note: 'Type "/" to see all of variables and function are supported.',
			},
		},
		{
			field: 'resetGroups',
			type: 'alias',
			meta: {
				interface: 'presentation-divider',
				options: {
					title: 'Reset Button',
				},
				special: ['alias', 'no-data', 'group'],
			},
		},
		{
			field: 'hideReset',
			name: 'Hidden',
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
			field: 'resetLabel',
			name: 'Label',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					trim: true,
					placeholder: 'Reset',
				},
			},
		},
		{
			field: 'resetType',
			name: 'Type',
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
			field: 'resetVariant',
			name: 'Variant',
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
				default_value: 'secondary',
			},
		},
		{
			field: 'onReset',
			name: 'on Click (Javascript)',
			type: 'text',
			meta: {
				width: 'full',
				interface: 'input-javascript',
				options: {
					minLine: 4,
					context: { $value: {} },
				},
				note: 'Type "/" to see all of variables and function are supported.',
			},
		},
		{
			field: 'stylesGroup',
			type: 'alias',
			meta: {
				interface: 'presentation-divider',
				options: {
					title: 'Styles',
				},
				special: ['alias', 'no-data', 'group'],
			},
		},
		{
			field: 'background',
			name: 'Background',
			type: 'string',
			meta: {
				interface: 'select-color',
				width: 'half',
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
					choices: shadowChoices,
				},
			},
		},
		{
			field: 'border',
			name: 'Border',
			type: 'string',
			meta: {
				interface: 'select-color',
				width: 'half',
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
					placeholder: 'None',
				},
			},
		},
		{
			field: 'padding',
			name: 'Padding',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					placeholder: '0px',
				},
				note: 'Spacing between its content and its border.<br><a target="_blank" tabindex="-1" href="https://developer.mozilla.org/en-US/docs/Web/CSS/padding">Learn more</a>',
			},
		},
		{
			field: 'gap',
			name: 'Grid Gap',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					placeholder: '24px',
				},
				note: 'Spacing between the widgets.<br><a target="_blank" tabindex="-1" href="https://developer.mozilla.org/en-US/docs/Web/CSS/gap">Learn more</a>',
			},
		},
	],
});
