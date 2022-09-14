import { defineDisplay } from '../../utils/define-extension';

export default defineDisplay({
	id: 'text',
	name: 'Text',
	icon: 'text_format',
	description: 'Display text',
	options: [
		{
			field: 'verticalAlignment',
			name: 'Vertical Alignment',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					choices: [
						{
							text: 'Top',
							value: 'top',
						},
						{
							text: 'Middle',
							value: 'middle',
						},
						{
							text: 'Bottom',
							value: 'bottom',
						},
					],
					placeholder: 'Select',
					allowNone: true,
				},
			},
		},
	],
	types: [],
});
