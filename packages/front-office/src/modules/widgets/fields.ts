import { validationRuleChoices } from './choices';

const validationsField = (rules: string[]) => {
	const choices = rules ? validationRuleChoices.filter((item) => rules.includes(item.value)) : validationRuleChoices;

	return {
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
								choices: choices,
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
							conditions: [
								{
									rule: {
										rule: {
											_in: ['accepted', 'required', 'email', 'number'],
										},
									},
									hidden: true,
								},
							],
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
	};
};

export { validationsField };
