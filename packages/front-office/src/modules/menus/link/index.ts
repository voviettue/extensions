import { defineMenu } from '../../utils/define-extension';

export default defineMenu({
	id: 'link',
	name: 'Link',
	icon: 'link',
	options: [
		{
			field: 'url',
			name: 'URL',
			type: 'string',
			meta: {
				required: true,
				interface: 'input',
				options: {
					trim: true,
					placeholder: 'https://example.com/example',
				},
			},
		},
	],
});
