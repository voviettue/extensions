import { defineWidget } from '../../utils/define-extension';

export default defineWidget({
	id: 'tabs',
	name: 'Tabs',
	icon: 'table-chart',
	tabs: true,
	options: ({ values }) => {
		const tabs = values?.options?.tabs || [];

		const options = [
			{
				field: 'tabs',
				name: 'Tabs',
				type: 'json',
				meta: {
					interface: 'list',
					options: {
						addLable: 'Add tab',
						template: '{{ label }}',
						fields: [
							{
								field: 'key',
								type: 'string',
								name: 'Key',
								meta: {
									interface: 'input',
									width: 'half',
									options: {
										placeholder: 'Tab name',
									},
								},
							},
							{
								field: 'label',
								type: 'string',
								name: 'Label',
								meta: {
									interface: 'input',
									width: 'half',
									options: {
										placeholder: 'Tab name',
									},
								},
							},
							{
								field: 'widgets',
								name: 'Widgets',
								type: 'json',
								meta: {
									hidden: true,
									interface: 'select-dropdown',
									choices: [],
									allowNone: true,
								},
								schema: {
									default_value: [],
								},
							},
							{
								field: 'icon',
								name: 'Icon',
								type: 'string',
								meta: {
									width: 'half',
									interface: 'select-icon',
								},
							},
							{
								field: 'hidden',
								name: 'Hidden',
								type: 'boolean',
								meta: {
									width: 'half',
									interface: 'boolean',
								},
								schema: {
									default_value: false,
								},
							},
						],
					},
				},
			},
			{
				field: 'tabDefault',
				name: 'Default Tab',
				type: 'string',
				meta: {
					width: 'haff',
					interface: 'select-dropdown',
					options: {
						choices: tabs?.map((e: any) => ({
							text: e.label,
							value: e.key,
						})),
						placeholder: 'Select tab',
						allowNone: true,
					},
				},
			},
			{
				field: 'border',
				name: 'Border Color',
				type: 'string',
				meta: {
					interface: 'select-color',
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
					options: {
						placeholder: '0px',
					},
				},
			},
			{
				field: 'onTabSelected',
				name: 'On Tab Click (Javascript)',
				meta: {
					width: 'full',
					interface: 'input-javascript',
					options: {
						minLine: 4,
					},
					note: 'Type "/" to see all of variables and function are supported.',
				},
			},
		];
		return options;
	},
});
