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
	],
});
