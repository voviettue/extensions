import { defineDisplay } from '../../utils/define-extension';

export default defineDisplay({
	id: 'date',
	name: 'Date',
	icon: 'calendar_month',
	description: 'Display date',
	options: [
		{
			field: 'format',
			name: 'Format',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					choices: [
						{ text: 'Long', value: 'long' },
						{ text: 'Short', value: 'short' },
					],
					allowOther: true,
				},
				note: 'The custom format accepts the __[Date Field Symbol Table](https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table)__',
			},
			schema: {
				default_value: 'long',
			},
		},
		{
			field: 'cellBackground',
			name: 'Cell Background',
			type: 'string',
			meta: {
				interface: 'select-color',
				width: 'half',
			},
		},
		{
			field: 'textColor',
			name: 'Text Color',
			type: 'string',
			meta: {
				interface: 'select-color',
				width: 'half',
			},
		},
		{
			field: 'textSize',
			name: 'Text Size',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					choices: [
						{
							text: 'XS - 0.75rem',
							value: '0.75rem',
						},
						{
							text: 'SM - 0.875rem',
							value: '0.875rem',
						},
						{
							text: 'LG - 1.125rem',
							value: '1.125rem',
						},
						{
							text: 'XL - 1.25rem',
							value: '1.25rem',
						},
						{
							text: '2XL - 1.5rem',
							value: '1.5rem',
						},
						{
							text: '3XL - 1.875rem',
							value: '1.875rem',
						},
					],
					placeholder: 'Select',
					allowNone: true,
				},
			},
		},
		{
			field: 'textAlign',
			name: 'Text Align',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					choices: [
						{
							text: 'Left',
							value: 'left',
						},
						{
							text: 'Right',
							value: 'right',
						},
						{
							text: 'Center',
							value: 'center',
						},
						{
							text: 'Justify',
							value: 'justify',
						},
					],
					placeholder: 'Select',
					allowNone: true,
				},
			},
		},
		{
			field: 'textStyle',
			name: 'Text Style',
			type: 'json',
			meta: {
				interface: 'select-multiple-dropdown',
				width: 'half',
				options: {
					choices: [
						{
							text: 'BOLD',
							value: 'bold',
						},
						{
							text: 'ITALIC',
							value: 'italic',
						},
						{
							text: 'UNDERLINE',
							value: 'underline',
						},
					],
					placeholder: 'Select',
					allowNone: true,
				},
			},
		},
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
	types: ['date', 'dateTime'],
});
