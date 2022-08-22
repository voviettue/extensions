import { defineWidget } from '../../utils/define-extension';

export default defineWidget({
	id: 'table',
	name: 'Table',
	icon: 'table',
	options: [
		{
			field: 'data',
			name: 'Data',
			type: 'json',
			meta: {
				interface: 'code',
				width: 'full',
			},
		},
		{
			field: 'columns',
			name: 'Columns',
			type: 'json',
			meta: {
				interface: 'list',
				options: {
					addLabel: 'Create New',
					template: '{{ label }}',
					fields: [
						{
							field: 'key',
							type: 'Key',
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
							field: 'label',
							name: 'Label',
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
	],
});
