export function formFields({ values }) {
	const fields = [
		{
			collection: 'cms_queries',
			field: 'output',
			name: 'Output',
			type: 'json',
			meta: {
				interface: 'code',
				readonly: true,
				placeholder: 'Enter code here...',
			},
		},
		{
			collection: 'cms_queries',
			field: 'name',
			name: 'Name',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'input',
				required: true,
				options: {
					trim: true,
					placeholder: 'Text',
				},
			},
		},
		{
			field: 'key',
			name: 'Key',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'input',
				required: true,
				unique: true,
				options: {
					trim: true,
				},
			},
		},
		{
			collection: 'cms_queries',
			field: 'timeout',
			name: 'Timeout',
			type: 'integer',
			meta: {
				width: 'half',
				interface: 'input',
				options: {
					trim: true,
				},
			},
			schema: {
				default_value: 10000,
				placeholder: 'Text',
			},
		},
		{
			collection: 'cms_queries',
			field: 'refresh_on_load',
			name: 'Refresh on load',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'boolean',
			},
		},
		{
			field: 'params',
			name: 'Query Params',
			type: 'json',
			meta: {
				interface: 'list',
				width: 'full',
				options: {
					addLabel: 'Add Param',
					template: '{{ name }}: {{ value }}',
					fields: [
						{
							field: 'name',
							name: 'Name',
							type: 'string',
							meta: {
								interface: 'input',
								width: 'half',
								required: true,
								trim: true,
							},
						},
						{
							field: 'value',
							name: 'Default Value',
							meta: {
								interface: 'input',
								width: 'half',
								options: {
									trim: true,
								},
							},
						},
					],
				},
			},
		},
	];

	const excludeField: string[] = [];

	if (!values.id) {
		excludeField.push('output');
	}

	if (values.query === 'json') {
		excludeField.push('refresh_on_load');
		excludeField.push('timeout');
	}

	return fields?.filter((e: any) => {
		return !excludeField.includes(e.field);
	});
}
