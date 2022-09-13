import { defineQuery } from '../../utils/define-extension';

export default defineQuery({
	id: 'api',
	name: 'Api',
	icon: 'http',
	options: ({ values }) => {
		const options = [
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
								value: 'get',
							},
							{
								text: 'POST',
								value: 'post',
							},
							{
								text: 'PUT',
								value: 'put',
							},
							{
								text: 'PATCH',
								value: 'patch',
							},
							{
								text: 'DELETE',
								value: 'delete',
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
		];

		const fieldParams = {
			field: 'params',
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
		};

		const fieldData = {
			field: 'data',
			name: 'Request Body',
			type: 'text',
			meta: {
				required: false,
				interface: 'input-code',
				width: 'full',
				options: {
					trim: true,
					placeholder: 'Any string or JSON...',
				},
			},
		};

		const method = values?.options?.method || '';

		switch (method) {
			case 'get':
				delete values?.options?.data;
				options.push(fieldParams);
				break;
			case 'patch':
			case 'post':
			case 'put':
				delete values?.options?.params;
				options.push(fieldData);
				break;
			default:
				delete values?.options?.data;
				delete values?.options?.params;
				break;
		}

		return options;
	},
});
