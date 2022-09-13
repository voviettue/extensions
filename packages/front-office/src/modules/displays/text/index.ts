import { defineDisplay } from '../../utils/define-extension';

export default defineDisplay({
	id: 'text',
	name: 'Text',
	icon: 'text_format',
	description: '',
	options: [
		{
			field: 'prefix',
			name: 'Prefix',
			type: 'string',
			meta: {
				width: 'half',
				required: true,
				interface: 'input',
				options: {
					trim: true,
				},
			},
		},
		{
			field: 'suffix',
			name: 'Suffix',
			type: 'string',
			meta: {
				width: 'half',
				required: true,
				interface: 'input',
				options: {
					trim: true,
				},
			},
		},
	],
	types: [],
});
