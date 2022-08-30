import { defineWidget } from '../../utils/define-extension';

export default defineWidget({
	id: 'divider',
	name: 'Divider',
	icon: 'minimize',
	options: [
		{
			field: 'orientation',
			name: 'Orientation',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					choices: [
						{
							text: 'Horizontal',
							value: 'horizontal',
						},
						{
							text: 'Vertical',
							value: 'vertical',
						},
					],
				},
			},
		},
		{
			field: 'strokeStyle',
			name: 'Stroke Style',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					choices: [
						{
							text: 'Solid',
							value: 'solid',
						},
						{
							text: 'Dashed',
							value: 'dashed',
						},
						{
							text: 'Dotted',
							value: 'dotted',
						},
					],
				},
			},
		},
		{
			field: 'width',
			name: 'Width',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					trim: true,
					placeholder: 'Enter width size in px',
				},
			},
		},
		{
			field: 'height',
			name: 'Height',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					trim: true,
					placeholder: 'Enter height size in px',
				},
			},
		},
		{
			field: 'color',
			name: 'Divider Color',
			type: 'string',
			meta: {
				interface: 'select-color',
				width: 'half',
			},
		},
		{
			field: 'cap',
			name: 'Cap',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					trim: true,
					placeholder: 'Enter cap here',
				},
			},
		},
		{
			field: 'capPosition',
			name: 'Cap Position',
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
							text: 'Bottom',
							value: 'bottom',
						},
						{
							text: 'Top',
							value: 'top',
						},
					],
				},
			},
		},
	],
});
