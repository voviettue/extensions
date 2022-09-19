import { defineWidget } from '../../utils/define-extension';

export default defineWidget({
	id: 'button',
	name: 'Button',
	icon: 'bookmark_border',
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
			field: 'buttonSize',
			name: 'Button Size',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					allowOther: true,
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
			field: 'buttonVariant',
			name: 'Button Variant',
			type: 'json',
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
					],
				},
			},
		},
		{
			field: 'borderRadius',
			name: 'Border Radius',
			type: 'number',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					trim: true,
					placeholder: 'Enter border width size in px',
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
		},
	],
});
