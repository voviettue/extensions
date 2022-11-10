import { defineWidget } from '../../utils/define-extension';

export default defineWidget({
	id: 'tab',
	name: 'Tab',
	icon: 'tab',
	group: true,
	child_of: 'tabs',
	options: [
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
			field: 'icon',
			name: 'Icon',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'select-icon',
			},
		},
		{
			field: 'onClick',
			name: 'On Click (Javascript)',
			meta: {
				width: 'full',
				interface: 'input-javascript',
				options: {
					minLine: 4,
				},
				note: 'Type "/" to see all of variables and function are supported.',
			},
		},
	],
});
