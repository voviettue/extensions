import { defineWidget } from '../../utils/define-extension';

export default defineWidget({
	id: 'select',
	name: 'Select',
	icon: 'manage_search',
	options: [
		{
			field: 'choices',
			name: 'Choices',
			type: 'json',
			meta: {
				interface: 'list',
				options: {
					addLabel: 'Add Choices',
					template: '{{ name }}: {{ value }}',
					fields: [
						{
							field: 'name',
							type: 'string',
							name: 'Name',
							meta: {
								interface: 'input',
								width: 'half',
								options: {
									placeholder: 'Name',
								},
							},
						},
						{
							field: 'value',
							name: 'Value',
							type: 'string',
							meta: {
								interface: 'input',
								width: 'half',
								options: {
									placeholder: 'Value',
								},
							},
						},
					],
				},
			},
		},
		{
			field: 'defaultValue',
			name: 'Default Value',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'full',
				options: {
					trim: true,
					placeholder: 'Enter default value to be displayed',
				},
			},
		},
		{
			field: 'allowOther',
			name: 'Allow Other',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'Boolean',
			},
		},
		{
			field: 'allowNone',
			name: 'Allow None',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'Boolean',
			},
		},
		{
			field: 'required',
			name: 'Required',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'Boolean',
			},
		},
		{
			field: 'placeholder',
			name: 'Placeholder',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'full',
				options: {
					trim: true,
					placeholder: 'Enter placeholder to be displayed',
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
			field: 'disable',
			name: 'Disable',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'Boolean',
			},
		},
		{
			field: 'allowSearching',
			name: 'Allow Searching',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'Boolean',
			},
		},
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
			field: 'labelPosition',
			name: 'Label Position',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					allowNone: true,
					choices: [
						{
							text: 'Left',
							value: 'left',
						},
						{
							text: 'Top',
							value: 'top',
						},
						{
							text: 'Auto',
							value: 'auto',
						},
					],
				},
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
					allowNone: true,
					choices: [
						{
							text: 'Left',
							value: 'left',
						},
						{
							text: 'Right',
							value: 'right',
						},
					],
				},
			},
		},
		{
			field: 'textColor',
			name: 'Text Color',
			type: 'string',
			meta: {
				interface: 'select-color',
				width: 'half',
			},
		},
		{
			field: 'textSize',
			name: 'Text Size',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					allowOther: true,
					allowNone: true,
					choices: [
						{
							text: 'XS - 0.75rem',
							value: '0.75rem',
						},
						{
							text: 'SM - 0.875rem',
							value: '0.875rem',
						},
						{
							text: 'LG - 1.125rem',
							value: '1.125rem',
						},
						{
							text: 'XL - 1.25rem',
							value: '1.25rem',
						},
						{
							text: '2XL - 1.5rem',
							value: '1.5rem',
						},
						{
							text: '3XL - 1.875rem',
							value: '1.875rem',
						},
					],
				},
			},
		},
		{
			field: 'textStyle',
			name: 'Text Style',
			type: 'json',
			meta: {
				interface: 'select-multiple-dropdown',
				width: 'half',
				options: {
					allowNone: true,
					choices: [
						{
							text: 'BOLD',
							value: 'bold',
						},
						{
							text: 'ITALIC',
							value: 'italic',
						},
						{
							text: 'UNDERLINE',
							value: 'underline',
						},
					],
				},
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
		{
			field: 'onChange',
			name: 'Event onChange',
			type: 'text',
			meta: {
				interface: 'input-code',
				width: 'full',
				options: {
					language: 'javascript',
					lineNumber: true,
					template: 'console.log("javascript")',
				},
			},
		},
	],
});
