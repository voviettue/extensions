import { defineWidget } from '../../utils/define-extension';

export default defineWidget({
	id: 'tabs',
	name: 'Tabs',
	icon: 'table-chart',
	tabs: true,
	options: [
		{
			field: 'tabs',
			name: 'Tabs',
			type: 'json',
			meta: {
				interface: 'list',
				options: {
					addLable: 'Add tab',
					template: 'Tab: {{ tab }}',
					fields: [
						{
							field: 'key',
							type: 'string',
							name: 'Key',
							meta: {
								interface: 'input',
								width: 'half',
								options: {
									placeholder: 'Tab name',
								},
							},
						},
						{
							field: 'tab',
							type: 'string',
							name: 'Tab',
							meta: {
								interface: 'input',
								width: 'half',
								options: {
									placeholder: 'Tab name',
								},
							},
						},
						{
							field: 'hidden',
							name: 'Hidden',
							type: 'boolean',
							meta: {
								width: 'half',
								interface: 'boolean',
							},
						},
					],
				},
			},
		},
	],
});
