import { defineMenu } from '../../utils/define-extension';
import { useFrontOfficeStore } from '../../stores/front-office';

export default defineMenu({
	id: 'page',
	name: 'Page',
	icon: 'article',
	options: () => {
		const frontOfficeStore = useFrontOfficeStore();

		const options = [
			{
				field: 'page',
				name: 'Page',
				type: 'string',
				meta: {
					required: true,
					interface: 'select-dropdown',
					options: {
						choices: frontOfficeStore.pages,
					},
				},
			},
		];
		return options;
	},
});
