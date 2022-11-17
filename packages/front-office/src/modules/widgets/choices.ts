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

const borderChoices = [
	{
		text: 'None',
		value: '0px',
	},
	{
		text: '0.125rem',
		value: '0.125rem',
	},
	{
		text: '0.25rem',
		value: '0.15rem',
	},
	{
		text: '0.375rem',
		value: '0.375rem',
	},
	{
		text: '0.5rem',
		value: '0.5rem',
	},
];
const validateWidget = {
	textInput: ['alpha', 'length', 'required', 'email', 'ends_with', 'matches', 'starts_with', 'url', 'is', 'not'],
	numberInput: ['required', 'min', 'max'],
	select: ['required'],
	mulitpleSelect: ['required'],
	textarea: ['alpha', 'length', 'required', 'email', 'ends_with', 'matches', 'starts_with', 'url', 'is', 'not'],
};

const validationRuleChoices = (widget: string) => {
	return [
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
	].filter((rule) => (validateWidget[widget] || []).includes(rule.value));
};

const fontStyleChoices = [
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
];

const buttonVariantChoices = [
	{
		text: 'Primary',
		value: 'primary',
	},
	{
		text: 'Secondary',
		value: 'secondary',
	},
	{
		text: 'Success',
		value: 'success',
	},
	{
		text: 'Warning',
		value: 'warning',
	},
	{
		text: 'Danger',
		value: 'danger',
	},
	{
		text: 'Info',
		value: 'info',
	},
	{
		text: 'Light',
		value: 'light',
	},
	{
		text: 'Dark',
		value: 'dark',
	},
];

const buttonTypeChoices = [
	{ text: 'Solid', value: 'solid' },
	{ text: 'Outline', value: 'outline' },
	{ text: 'Link', value: 'link' },
	{ text: 'Ghost', value: 'ghost' },
];

const positionChoices = [
	{ text: 'Left', value: 'left' },
	{ text: 'Center', value: 'center' },
	{ text: 'Right', value: 'right' },
];
const buttonSizeChoices = [
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
];

export {
	sizeChoices,
	fontFamilyChoices,
	shadowChoices,
	borderChoices,
	validationRuleChoices,
	fontStyleChoices,
	buttonVariantChoices,
	buttonTypeChoices,
	positionChoices,
	buttonSizeChoices,
};
