import { defineWidget } from '../../utils/define-extension';
import { buttonTypeChoices, buttonVariantChoices, shadowChoices, borderChoices } from '../choices';

export default defineWidget({
	id: 'modal',
	name: 'Modal',
	icon: 'call_to_action',
	group: true,
	options: [
		{
			field: 'defaultValue',
			name: 'Default Value',
			type: 'string',
			meta: {
				interface: 'input-multiline',
				width: 'full',
			},
		},
		{
			field: 'titleOptions',
			type: 'alias',
			meta: {
				interface: 'presentation-divider',
				options: {
					title: 'Label',
				},
				special: ['alias', 'no-data', 'group'],
			},
		},
		{
			field: 'title',
			name: 'Title',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					trim: true,
					placeholder: 'Enter title to be displayed',
				},
			},
		},
		{
			field: 'showTitle',
			name: 'Show Title',
			type: 'boolean',
			meta: {
				interface: 'boolean',
				width: 'half',
				options: {
					label: 'Show modal title',
				},
			},
			schema: {
				default_value: true,
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
			field: 'showIcon',
			name: 'Show Icon',
			type: 'boolean',
			meta: {
				interface: 'boolean',
				width: 'half',
				options: {
					label: 'Show icon on the left of title',
				},
			},
			schema: {
				default_value: false,
			},
		},
		{
			field: 'submitButtonOptions',
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
					placeholder: 'Save',
				},
			},
		},
		{
			field: 'submitType',
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
			field: 'submitVariant',
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
			field: 'submitBorderRadius',
			name: 'Border Radius',
			type: 'string',
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
			field: 'submitShadow',
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
		{
			field: 'onSubmit',
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
			field: 'cancelButtonOptions',
			type: 'alias',
			meta: {
				interface: 'presentation-divider',
				options: {
					title: 'Cancel Button',
				},
				special: ['alias', 'no-data', 'group'],
			},
		},
		{
			field: 'hideCancel',
			name: 'Hidden',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'Boolean',
			},
		},
		{
			field: 'cancelLabel',
			name: 'Label',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					trim: true,
					placeholder: 'Cancel',
				},
			},
		},
		{
			field: 'cancelType',
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
			field: 'cancelVariant',
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
			field: 'cancelBorderRadius',
			name: 'Border Radius',
			type: 'string',
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
			field: 'cancelShadow',
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
		{
			field: 'onCancel',
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
			field: 'styleOptions',
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
			name: 'Background Color',
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
					allowNone: true,
					choices: shadowChoices,
				},
			},
		},
		{
			field: 'border',
			name: 'Border',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'select-color',
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
			field: 'padding',
			name: 'Padding',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					placeholder: '20px',
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
		{
			field: 'width',
			name: 'Width',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'select-dropdown',
				default: 'medium',
				options: {
					allowOther: true,
					choices: [
						{
							value: '300px',
							text: 'Small - 300px',
						},
						{
							value: '500px',
							text: 'Medium - 500px',
						},
						{
							value: '800px',
							text: 'Large - 800px',
						},
						{
							value: '1140px',
							text: 'Extra Large - 1140px',
						},
					],
				},
			},
			schema: {
				default_value: '500px',
			},
		},
	],
});
