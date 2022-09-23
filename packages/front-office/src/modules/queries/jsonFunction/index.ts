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
				options: {
					language: 'javascript',
					lineNumber: true,
					template:
						'{\n\t"object": "enter value...",\n\tmyFun1: () => {\n\t\treturn "something..."\n\t},\n\tmyFun2: (param) => {\n\t\treturn param\n\t},\n    myFun3: async () => {\n\t\tconst data = fetch("enter url...")\n        .then(response => response.json())\n\t\t.then(data => data);\n\t\treturn data;\n\t},\n}',
				},
			},
		},
	],
	beforeSave: (values) => {
		if (values?.options?.code) {
			values.output = values?.options?.code;
			values.refresh_on_load = false;
		}
		return values;
	},
});
