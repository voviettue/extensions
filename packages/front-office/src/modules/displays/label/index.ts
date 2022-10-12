import { defineDisplay } from '../../utils/define-extension';

export default defineDisplay({
	id: 'label',
	name: 'Label',
	icon: 'flag',
	description: 'Display label',
	displayOptions: [
		{
			field: 'format',
			name: 'Format text',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'boolean',
				options: {
					label: 'Format each label',
				},
			},
			schema: {
				default_value: true,
			},
		},
		{
			field: 'showAsDot',
			name: 'Show As Dot',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'boolean',
			},
			schema: {
				default_value: false,
			},
		},
		{
			field: 'choices',
			name: 'Choices',
			type: 'json',
			meta: {
				interface: 'list',
				options: {
					template: '{{text}}',
					fields: [
						{
							field: 'text',
							name: 'Text',
							type: 'string',
							meta: {
								interface: 'system-input-translated-string',
								width: 'half',
								options: {
									placeholder: 'Enter a text...',
								},
							},
						},
						{
							field: 'value',
							name: 'Value',
							type: 'string',
							meta: {
								interface: 'input',
								options: {
									font: 'monospace',
									placeholder: 'Enter a value...',
								},
								width: 'half',
							},
						},
						{
							field: 'foreground',
							name: 'Foreground Color',
							type: 'string',
							meta: {
								interface: 'select-color',
								width: 'half',
							},
						},
						{
							field: 'background',
							name: 'Background Color',
							type: 'string',
							meta: {
								interface: 'select-color',
								width: 'half',
							},
						},
					],
				},
			},
		},
	],
	types: [],
});
