import { defineQuery } from '../../utils/define-extension';

export default defineQuery({
	id: 'json',
	name: 'Json',
	icon: 'code',
	options: [
		{
			field: 'jsonData',
			name: 'Json data',
			type: 'json',
			meta: {
				interface: 'code',
				required: true,
				placeholder: 'Enter code here...',
			},
		},
	],
});
