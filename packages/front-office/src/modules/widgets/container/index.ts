import { defineWidget } from '../../utils/define-extension';

export default defineWidget({
	id: 'container',
	name: 'Container',
	icon: 'settings_overscan',
	group: true,
	options: [
		{
			field: 'background',
			name: 'Background',
			type: 'string',
			meta: {
				interface: 'select-color',
				width: 'half',
			},
		},
		{
			field: 'shadow',
			name: 'Box Shadow',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					choices: [
						{
							text: 'Default',
							value: null,
						},
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
					],
				},
			},
		},
		{
			field: 'border',
			name: 'Border',
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
			field: 'padding',
			name: 'Padding',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					placeholder: '0px',
				},
				note: 'Spacing between its content and its border.<br><a target="_blank" tabindex="-1" href="https://developer.mozilla.org/en-US/docs/Web/CSS/padding">Learn more</a>',
			},
		},
		{
			field: 'gap',
			name: 'Grid Gap',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					placeholder: '24px',
				},
				note: 'Spacing between the widgets.<br><a target="_blank" tabindex="-1" href="https://developer.mozilla.org/en-US/docs/Web/CSS/gap">Learn more</a>',
			},
		},
	],
});
