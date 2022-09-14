import { defineWidget } from '../../utils/define-extension';

export default defineWidget({
	id: 'iframe',
	name: 'Iframe',
	icon: 'menu',
	options: [
		{
			field: 'Url',
			name: 'URL',
			type: 'string',
			meta: {
				required: true,
				interface: 'input',
				width: 'full',
				options: {
					trim: true,
					placeholder: 'Embed Url Here',
				},
			},
		},
		{
			field: 'ratioWidth',
			name: 'Ratio Width',
			type: 'integer',
			meta: {
				interface: 'input',
				width: 'full',
				options: {
					trim: true,
					placeholder: 'Ratio Width Here',
				},
			},
		},
		{
			field: 'ratioHeight',
			name: 'Ratio Height',
			type: 'integer',
			meta: {
				interface: 'input',
				width: 'full',
				options: {
					trim: true,
					placeholder: 'Ratio Height Here',
				},
			},
		},
	],
});
