import { defineWidget } from '../../utils/define-extension';

export default defineWidget({
	id: 'list',
	name: 'List',
	icon: 'menu',
	group: true,
	options: [
		{
			field: 'data',
			name: 'Data',
			type: 'json',
			meta: {
				interface: 'code',
				width: 'full',
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
			field: 'itemBackground',
			name: 'Item Background',
			type: 'string',
			meta: {
				interface: 'select-color',
				width: 'half',
			},
		},
		{
			field: 'itemSpacing',
			name: 'Item Spacing',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					trim: true,
					placeholder: 'Enter space size in px',
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
		{
			field: 'border',
			name: 'Border',
			type: 'string',
			meta: {
				interface: 'select-color',
				width: 'half',
			},
		},
		{
			field: 'borderRadius',
			name: 'Border Radius',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
			},
		},
	],
});
