import { defineWidget } from '../../utils/define-extension';

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
});
