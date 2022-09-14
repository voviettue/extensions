import { defineQuery } from '../../utils/define-extension';

export default defineQuery({
	id: 'json',
	name: 'Json',
	icon: 'code',
	options: [
		{
			field: 'json',
			name: 'Json data',
			type: 'json',
			meta: {
				interface: 'code',
				required: true,
				placeholder: 'Enter code here...',
			},
		},
	],
	beforeSave: (values) => {
		if (values?.options?.json) {
			values.output = values?.options?.json;
			values.refresh_on_load = false;
		}
		return values;
	},
});
