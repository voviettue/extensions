import { defineMenu } from '../../utils/define-extension';
import { useFrontOfficeStore } from '../../stores/front-office';

export default defineMenu({
	id: 'page',
	name: 'Page',
	icon: 'article',
	options: () => {
		const store = useFrontOfficeStore();
		const pages = store.pages.map((item: any) => {
			return {
				value: item.id,
				text: item.title,
			};
		});

		const options = [
			{
				field: 'page',
				name: 'Page',
				type: 'string',
				meta: {
					required: true,
					interface: 'select-dropdown',
					options: {
						choices: pages,
					},
				},
			},
		];
		return options;
	},
});
