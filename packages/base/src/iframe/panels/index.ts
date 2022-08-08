import PanelComponent from './panel.vue';

export default {
	id: 'panel-iframe',
	name: 'Iframe',
	icon: 'insert_photo',
	description: 'Show a web page based on an embed URL',
	component: PanelComponent,
	options: [
		{
			field: 'url',
			name: 'Url',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'full',
			},
		},
	],
	minWidth: 12,
	minHeight: 8,
};
