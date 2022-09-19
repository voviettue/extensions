import { defineDisplay } from '../../utils/define-extension';
import text from '../../widgets/text';

export default defineDisplay({
	id: 'text',
	name: 'Text',
	icon: 'text_format',
	description: 'Display text',
	displayOptions: ({ values }) => {
		const options = [
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
			...text.options,
		].filter((option: any) => option.field !== 'text');

		return options;
	},
	types: [],
});
