import { defineQuery } from '../../utils/define-extension';

export default defineQuery({
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
				width: 'half',
				options: {
					trim: true,
					placeholder: 'Url',
				},
			},
		},
		{
			field: 'defaultImage',
			name: 'DefaultImage',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					trim: true,
					placeholder: 'Default image',
				},
			},
		},
		{
			field: 'objectFit',
			name: 'ObjectFit',
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
			type: 'number',
			meta: {
				interface: 'input',
				width: 'half',
			},
		},
		{
			field: 'borderRadius',
			name: 'BorderRadius',
			type: 'string',
			meta: {
				interface: 'input',
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
			name: 'RatioWidth',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
			},
		},
		{
			field: 'ratioHeight',
			name: 'RatioHeight',
			type: 'string',
			meta: {
				interface: 'string',
				width: 'half',
			},
		},
	],
});
