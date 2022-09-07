import { defineWidget } from '../../utils/define-extension';

export default defineWidget({
	id: 'richText',
	name: 'Rich Text',
	icon: 'chat',
	options: [
		{
			field: 'content',
			name: 'Rich Text',
			type: 'string',
			meta: {
				required: true,
				interface: 'input-rich-text-html',
				width: 'full',
				options: {
					trim: true,
					placeholder: 'Enter content here',
				},
			},
		},
	],
});
