import { defineWidget } from '../../utils/define-extension';

export default defineWidget({
	id: 'container',
	name: 'Container',
	icon: 'menu',
	options: [
		// {
		// 	field: 'columns',
		// 	name: 'Grid Columns',
		// 	type: 'integer',
		// 	meta: {
		// 		interface: 'input',
		// 		width: 'half',
		// 	},
		// },
		// {
		// 	field: 'gap',
		// 	name: 'Grid Gap',
		// 	type: 'integer',
		// 	meta: {
		// 		interface: 'input',
		// 		width: 'half',
		// 	},
		// },
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
			field: 'shadow',
			name: 'Box Shadow',
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
