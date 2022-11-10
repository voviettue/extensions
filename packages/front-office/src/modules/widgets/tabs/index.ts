import { defineWidget } from '../../utils/define-extension';
import { useWidgetStore } from '../../stores/widget';
import { storeToRefs } from 'pinia';

let isCreate = true;

export default defineWidget({
	id: 'tabs',
	name: 'Tabs',
	icon: 'tab',
	group: true,
	options: ({ values }) => {
		const store = useWidgetStore();
		const { widgets } = storeToRefs(store);
		const children = widgets.value.filter((e: any) => e.parent === values?.id && e.widget === 'tab');

		const options = [
			{
				field: 'defaultTab',
				name: 'Default Tab',
				type: 'string',
				meta: {
					width: 'haff',
					interface: 'select-dropdown',
					options: {
						choices: children.map((e: any) => ({
							text: e.name,
							value: e.id,
						})),
						placeholder: 'Select Tab',
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
				field: 'onChangeTab',
				name: 'On Change Tab (Javascript)',
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
	beforeSave: (values) => {
		isCreate = true;
		if (values?.id) isCreate = false;
		return values;
	},
	saved: async (widget) => {
		if (!isCreate) return;

		const store = useWidgetStore();
		for (const index of [1, 2]) {
			const tab = await store.create({
				name: `Tab ${index}`,
				options: {
					label: `Tab ${index}`,
				},
				widget: 'tab',
				page: widget.page,
				width: 'full',
				parent: widget.id,
			});
			await store.update(tab.id, { key: `${widget.key}_tab_${tab.id}` });
		}
	},
});
