import { defineWidget } from '../../utils/define-extension';

export default defineWidget({
	id: 'image',
	name: 'Image',
	icon: 'camera',
	options: [
		{
			field: 'url',
			name: 'Url',
			type: 'string',
			meta: {
				required: true,
				interface: 'input',
				width: 'full',
				options: {
					trim: true,
					placeholder: 'Url',
				},
			},
		},
		{
			field: 'defaultImage',
			name: 'Default Image',
			type: 'uuid',
			meta: {
				width: 'full',
				interface: 'file',
			},
		},
		{
			field: 'objectFit',
			name: 'Object Fit',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					choices: [
						{
							text: 'AUTO',
							value: 'auto',
						},
						{
							text: 'CONTAIN',
							value: 'contain',
						},
						{
							text: 'COVER',
							value: 'cover',
						},
						{
							text: 'FILL',
							value: 'fill',
						},
					],
				},
			},
		},
		{
			field: 'zoom',
			name: 'Zoom',
			type: 'integer',
			meta: {
				interface: 'input',
				width: 'half',
			},
		},
		{
			field: 'borderRadius',
			name: 'Border Radius',
			type: 'string',
			meta: {
				interface: 'select-color',
				width: 'half',
			},
		},
		{
			field: 'shadow',
			name: 'Shadow',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
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
			field: 'ratioWidth',
			name: 'Ratio Width',
			type: 'integer',
			meta: {
				interface: 'input',
				width: 'half',
			},
		},
		{
			field: 'ratioHeight',
			name: 'Ratio Height',
			type: 'integer',
			meta: {
				interface: 'string',
				width: 'half',
			},
		},
	],
});
