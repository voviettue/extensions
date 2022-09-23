import { defineQuery } from '../../utils/define-extension';

export default defineQuery({
	id: 'jsonFunction',
	name: 'Json function',
	icon: 'code',
	options: [
		{
			field: 'isAsync',
			name: 'Async Function',
			type: 'boolean',
			schema: {
				default_value: 'false',
			},
			meta: {
				width: 'half',
				interface: 'boolean',
			},
		},
		{
			field: 'confirmBeforeCalling',
			name: 'Confirm Before Calling',
			type: 'boolean',
			schema: {
				default_value: 'false',
			},
			meta: {
				width: 'half',
				interface: 'boolean',
			},
		},
		{
			field: 'code',
			name: 'Code',
			meta: {
				interface: 'input-code',
				required: true,
				placeholder: 'Enter code here...',
			},
		},
	],
	beforeSave: (values) => {
		if (values?.options?.json) {
			values.output = values?.options?.code;
			values.refresh_on_load = false;
		}
		return values;
	},
});
