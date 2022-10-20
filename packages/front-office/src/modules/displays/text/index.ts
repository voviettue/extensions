import { defineDisplay } from '../../utils/define-extension';
import cloneDeep from 'lodash/cloneDeep';
import text from '../../widgets/text';

export default defineDisplay({
	id: 'text',
	name: 'Text',
	icon: 'text_format',
	description: 'Display text',
	displayOptions: ({ values }) => {
		const textOptions = cloneDeep(text.options) as [];
		const textField: any = textOptions.filter((e: any) => e.field === 'text').pop();
		textField.meta.required = false;
		textField.meta.options.placeholder = 'Override by default';
		const options = [
			...[textField],
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
			...textOptions.filter((e: any) => e.field !== 'text'),
		];

		return options;
	},
	types: [],
});
