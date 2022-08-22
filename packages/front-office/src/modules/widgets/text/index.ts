import { defineWidget } from '../../utils/define-extension';

export default defineWidget({
	id: 'text',
	name: 'Text',
	icon: 'chat',
	options: [
		{
			field: 'text',
			name: 'Text',
			type: 'string',
			meta: {
				required: true,
				interface: 'input',
				width: 'half',
				options: {
					trim: true,
					placeholder: 'Text String',
				},
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
			name: 'TextStyle',
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
			name: 'FontFamily',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					choices: [
						{
							text: 'Roboto',
							value: 'Roboto',
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
							text: 'Times New Roman',
							value: 'Times New Roman',
						},
						{
							text: 'Monaco',
							value: 'Monaco',
						},
						{
							text: 'Courier New',
							value: 'Courier New',
						},
					],
				},
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
			field: 'border',
			name: 'Border',
			type: 'string',
			meta: {
				interface: 'select-color',
				width: 'half',
			},
		},
	],
});
