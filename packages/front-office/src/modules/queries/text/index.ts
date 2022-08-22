import { defineQuery } from '../../utils/define-extension';

export default defineQuery({
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
			name: 'TextSize',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					trim: true,
					placeholder: 'Text Size',
				},
			},
		},
		{
			field: 'textColor',
			name: 'TextColor',
			type: 'string',
			meta: {
				interface: 'select-color',
				width: 'half',
			},
		},
		{
			field: 'textAlign',
			name: 'TextAlign',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					choices: [
						{
							text: 'LEFT',
							value: 'left',
						},
						{
							text: 'RIGHT',
							value: 'right',
						},
						{
							text: 'CENTER',
							value: 'center',
						},
						{
							text: 'JUSTIFY',
							value: 'justify',
						},
					],
				},
			},
		},
		{
			field: 'textStyle',
			name: 'TextStyle',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
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
					choices: [],
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
				interface: 'string',
				width: 'half',
			},
		},
	],
});
