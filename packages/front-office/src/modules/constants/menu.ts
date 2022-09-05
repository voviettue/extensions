export const formFields = [
	{
		field: 'label',
		name: 'Label',
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
			options: {
				trim: true,
				placeholder: 'Text',
			},
		},
	},
	{
		field: 'icon',
		name: 'icon',
		type: 'string',
		meta: {
			width: 'full',
			interface: 'select-icon',
		},
	},
];
