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
			schema: {
				default_value: 'horizontal',
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
					allowNone: true,
				},
			},
		},
		{
			field: 'lineWidth',
			name: 'Line Width',
			type: 'integer',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					trim: true,
					placeholder: 'Enter the length in px here',
				},
			},
		},
		{
			field: 'lineHeight',
			name: 'Line Height',
			type: 'integer',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					trim: true,
					placeholder: 'Enter the thickness in px here',
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
							text: 'Center',
							value: 'center',
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
							text: 'Bottom',
							value: 'bottom',
						},
						{
							text: 'Top',
							value: 'top',
						},
					],
					allowNone: true,
				},
			},
		},
	],
});
