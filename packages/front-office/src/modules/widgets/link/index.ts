import { defineWidget } from '../../utils/define-extension';

export default defineWidget({
	id: 'link',
	name: 'Link',
	icon: 'link',
	options: [
		{
			field: 'url',
			name: 'URL',
			type: 'string',
			meta: {
				required: true,
				interface: 'input',
				width: 'full',
				options: {
					trim: true,
					placeholder: 'Enter URL to be displayed',
				},
			},
		},
		{
			field: 'text',
			name: 'Display Text',
			type: 'string',
			meta: {
				required: true,
				interface: 'input',
				width: 'full',
				options: {
					trim: true,
					placeholder: 'Enter Text to be displayed',
				},
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
			field: 'newTab',
			name: 'Open in new tab',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'Boolean',
			},
			schema: {
				default_value: true,
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
					choices: [
						{
							text: 'Default',
							value: null,
						},
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
			field: 'textColor',
			name: 'Text Color',
			type: 'string',
			meta: {
				interface: 'select-color',
				width: 'half',
			},
		},
		{
			field: 'textAlign',
			name: 'Text Align',
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
							text: 'Left',
							value: 'left',
						},
						{
							text: 'Right',
							value: 'right',
						},
						{
							text: 'Center',
							value: 'center',
						},
						{
							text: 'Justify',
							value: 'justify',
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
							text: 'Noto Sans',
							value: 'Noto Sans',
						},
						{
							text: 'Roboto',
							value: 'Roboto',
						},
						{
							text: 'Monaco',
							value: 'Monaco',
						},
						{
							text: 'Inter',
							value: 'Inter',
						},
					],
				},
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
			field: 'borderColor',
			name: 'Border Color',
			type: 'string',
			meta: {
				interface: 'select-color',
				width: 'half',
			},
		},
		{
			field: 'borderWidth',
			name: 'Border Width',
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
	],
});
