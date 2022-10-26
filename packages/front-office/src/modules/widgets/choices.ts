const sizeChoices = [
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
];

const fontFamilyChoices = [
	{
		text: 'Arial',
		value: 'Arial',
	},
	{
		text: 'Cambria',
		value: 'Cambria',
	},
	{
		text: 'Courier New',
		value: 'Courier New',
	},
	{
		text: 'Lato',
		value: 'Lato',
	},
	{
		text: 'Noto Sans',
		value: 'Noto Sans',
	},
	{
		text: 'Roboto',
		value: 'Roboto',
	},
	{
		text: 'Monaco',
		value: 'Monaco',
	},
	{
		text: 'Inter',
		value: 'Inter',
	},
];

const shadowChoices = [
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
];

const validationRuleChoices = [
	{
		value: 'is',
		text: 'Is',
	},
	{
		value: 'accepted',
		text: 'Accepted',
	},
	{
		value: 'email',
		text: 'Email',
	},
	{
		value: 'ends_with',
		text: 'Ends With',
	},
	{
		value: 'alpha',
		text: 'Alpha',
	},
	{
		value: 'date_before',
		text: 'Date Before',
	},
	{
		value: 'date_after',
		text: 'Date After',
	},
	{
		value: 'date_format',
		text: 'Date Format',
	},
	{
		value: 'length',
		text: 'Length',
	},
	{
		value: 'matches',
		text: 'Matches',
	},
	{
		value: 'max',
		text: 'Max',
	},
	{
		value: 'min',
		text: 'Min',
	},
	{
		value: 'not',
		text: 'Not',
	},
	{
		value: 'required',
		text: 'Required',
	},
	{
		value: 'starts_with',
		text: 'Starts With',
	},
	{
		value: 'url',
		text: 'Url',
	},
];

export { sizeChoices, fontFamilyChoices, shadowChoices, validationRuleChoices };
