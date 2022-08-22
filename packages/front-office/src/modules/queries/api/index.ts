import { defineQuery } from '../../utils/define-extension';

export default defineQuery({
	id: 'api',
	name: 'Api',
	icon: 'http',
	options: [
		{
			field: 'method',
			name: 'Method',
			type: 'string',
			meta: {
				required: true,
				interface: 'select-dropdown',
				width: 'half',
				options: {
					choices: [
						{
							text: 'GET',
							value: 'GET',
						},
						{
							text: 'POST',
							value: 'POST',
						},
						{
							text: 'PUT',
							value: 'PUT',
						},
						{
							text: 'PATCH',
							value: 'PATCH',
						},
						{
							text: 'DELETE',
							value: 'DELETE',
						},
					],
				},
			},
		},
		{
			field: 'url',
			name: 'Url',
			type: 'string',
			meta: {
				required: true,
				interface: 'input',
				width: 'half',
				options: {
					trim: true,
					placeholder: 'https://example.com/example',
				},
			},
		},
		{
			field: 'headers',
			name: 'Headers',
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
			field: 'query',
			name: 'Query',
			type: 'json',
			meta: {
				interface: 'list',
				options: {
					addLabel: 'Add Query',
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
			field: 'request_body',
			name: 'Request Body',
			type: 'text',
			meta: {
				interface: 'input-code',
				options: {
					placeholder: 'Any string or JSON...',
				},
			},
		},
	],
});