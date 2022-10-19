import { defineWidget } from '../../utils/define-extension';

export default defineWidget({
	id: 'image',
	name: 'Image',
	icon: 'image',
	options: ({ values }) => {
		if (values?.options?.defaultImage) {
			values.options.project_logo = values.options.defaultImage;
			values.options.defaultImage = null;
		}

		const dynamicField =
			values?.options?.type === 'file'
				? {
						field: 'file',
						name: 'File ID',
						type: 'string',
						meta: {
							interface: 'input',
							width: 'full',
							options: {
								trim: true,
								placeholder: '3a7d4ed4-415a-474b-a1a8-981e433fe6e4',
							},
						},
				  }
				: {
						field: 'url',
						name: 'URL',
						type: 'string',
						meta: {
							interface: 'input',
							width: 'full',
							options: {
								trim: true,
								placeholder: 'https://example.com',
							},
						},
				  };

		return [
			{
				field: 'type',
				name: 'Type',
				type: 'string',
				meta: {
					interface: 'select-radio',
					width: 'full',
					options: {
						choices: [
							{
								value: 'url',
								text: 'Url',
							},
							{
								value: 'file',
								text: 'File',
							},
						],
					},
				},
				schema: {
					default_value: 'url',
				},
			},
			dynamicField,
			{
				collection: 'cms_settings',
				field: 'project_logo',
				type: 'uuid',
				meta: {
					special: ['file'],
					interface: 'file-image',
					width: 'full',
				},
				name: 'Default Image',
			},
			{
				field: 'objectFit',
				name: 'Object Fit',
				type: 'string',
				meta: {
					interface: 'select-dropdown',
					width: 'half',
					options: {
						choices: [
							{
								text: 'None',
								value: 'none',
							},
							{
								text: 'AUTO',
								value: 'auto',
							},
							{
								text: 'CONTAIN',
								value: 'contain',
							},
							{
								text: 'COVER',
								value: 'cover',
							},
							{
								text: 'FILL',
								value: 'fill',
							},
						],
					},
				},
			},
			{
				field: 'zoom',
				name: 'Zoom',
				type: 'integer',
				meta: {
					interface: 'input',
					width: 'half',
				},
			},
			{
				field: 'borderRadius',
				name: 'Border Radius',
				type: 'string',
				meta: {
					interface: 'input',
					width: 'half',
				},
			},
			{
				field: 'shadow',
				name: 'Box Shadow',
				type: 'string',
				meta: {
					interface: 'select-dropdown',
					width: 'half',
					options: {
						choices: [
							{
								text: 'None',
								value: 'none',
							},
							{
								text: 'SM',
								value: 'sm',
							},
							{
								text: 'MD',
								value: 'md',
							},
							{
								text: 'LG',
								value: 'lg',
							},
							{
								text: 'XL',
								value: 'xl',
							},
							{
								text: '2XL',
								value: '2xl',
							},
						],
					},
				},
			},
			{
				field: 'ratioWidth',
				name: 'Ratio Width',
				type: 'integer',
				meta: {
					interface: 'input',
					width: 'half',
				},
			},
			{
				field: 'ratioHeight',
				name: 'Ratio Height',
				type: 'integer',
				meta: {
					interface: 'string',
					width: 'half',
				},
			},
		];
	},
	beforeSave: (values) => {
		if (values?.options?.project_logo) {
			values.options.defaultImage = values.options.project_logo;
			delete values.options.project_logo;
		} else {
			delete values.options.defaultImage;
		}
		return values;
	},
});
