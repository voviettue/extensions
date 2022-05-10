import { defineInterface } from '@directus/shared/utils';
import InterfaceDisplayTemplate from './interface.vue';

export default defineInterface({
	id: 'formula-display-template',
	name: 'Display Formula Template',
	description: '$t:interfaces.system-display-template.description',
	icon: 'arrow_drop_down_circle',
	component: InterfaceDisplayTemplate,
	types: ['string'],
	system: true,
	options: [
		{
			field: 'collectionField',
			name: '$t:interfaces.system-display-template.collection_field',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'input',
			},
			schema: {
				default_value: null,
			},
		},
	],
});
