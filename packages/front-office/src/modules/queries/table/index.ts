import { defineQuery } from '../../utils/define-extension';

export default defineQuery({
	id: 'table',
	name: 'Table',
	icon: 'table',
	options: [
		/**meta: {
				interface: 'list',
				options: {
					addLabel: 'Add Header',
					template: '{{ key }}: {{ value }}',
					fields: [
						{
							field: 'key',
							type: 'string',
							name: 'Key',
							meta: {
								interface: 'input',
								width: 'half',
								options: {
									placeholder: 'Key',
								},
							},
						},
						{
							field: 'value',
							name: 'Value',
							type: 'string',
							meta: {
								interface: 'input',
								width: 'half',
								options: {
									placeholder: 'Value',
								},
							},
						},
					],
				},
			}, */
		{
			field: 'columns',
			name: 'Column',
			type: 'json',
			meta: {
				interface: 'list',
				options: {
					addLabel: 'Add Header',
					template: '{{ key }}: {{ value }}',
					fields: [
						{
							field: 'key',
							type: 'string',
							name: 'Key',
							meta: {
								interface: 'input',
								width: 'half',
								options: {
									placeholder: 'Key',
								},
							},
						},
						{
							field: 'value',
							name: 'Value',
							type: 'string',
							meta: {
								interface: 'input',
								width: 'half',
								options: {
									placeholder: 'Value',
								},
							},
						},
					],
				},
			},
		},
		{
			field: 'data',
			name: 'Data',
			type: 'json',
			meta: {
				interface: 'code',
				width: 'full',
			},
		},
	],
});
