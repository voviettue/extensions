import { validationRuleChoices } from './choices';

const validationsField = (widget: string) => ({
	field: 'validations',
	name: 'Rules',
	type: 'json',
	meta: {
		interface: 'list',
		width: 'full',
		options: {
			addLabel: 'Add Rule',
			template: '{{rule}}:{{value}}',
			fields: [
				{
					field: 'rule',
					name: 'Rule',
					meta: {
						interface: 'select-dropdown',
						width: 'half',
						options: {
							placeholder: 'Select a rule',
							choices: validationRuleChoices(widget),
						},
					},
				},
				{
					field: 'value',
					name: 'Value',
					meta: {
						interface: 'input',
						width: 'half',
						options: {
							trim: true,
							placeholder: 'Enter a value...',
						},
					},
				},
				{
					field: 'errorMessage',
					name: 'Error Message',
					meta: {
						interface: 'input',
						width: 'full',
						options: {
							trim: true,
							placeholder: 'Overrided by default',
						},
					},
				},
			],
		},
	},
});

export { validationsField };
