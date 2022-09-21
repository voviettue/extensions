import { defineModule } from '@directus/extensions-sdk';
import SettingComponent from './routes/setting.vue';
import PagesComponent from './routes/pages.vue';
import QueriesComponent from './routes/queries.vue';
import NewPageComponent from './components/pages/page-create.vue';
import PageDetailComponent from './components/pages/page-detail.vue';
import NewQueryComponent from './components/queries/query-create.vue';
import QueryDetailsComponent from './components/queries/query-details.vue';
import NewWidgetComponent from './components/widgets/widget-create.vue';
import NewMenuComponent from './components/settings/menu-create.vue';
import MenuDetailComponent from './components/settings/menu-detail.vue';

export default defineModule({
	id: 'front-office',
	name: 'App Builder',
	icon: 'web',
	routes: [
		{
			path: '',
			redirect: '/front-office/settings',
		},
		{
			path: '/front-office/settings',
			component: SettingComponent,
			children: [
				{
					path: 'project/:projectId/menu/+',
					name: 'setting-menu-create',
					components: {
						add_menu: NewMenuComponent,
					},
				},
				{
					path: 'project/:projectId/menu/:menuId',
					name: 'setting-menu-detail',
					components: {
						update_menu: MenuDetailComponent,
					},
				},
			],
		},
		{
			name: 'front-office-page',
			path: '/front-office/pages',
			component: PagesComponent,
			children: [
				{
					path: '+',
					name: 'page-add-new',
					components: {
						add: NewPageComponent,
					},
				},
			],
		},
		{
			name: 'page-detail',
			path: '/front-office/pages/:id',
			component: PageDetailComponent,
			children: [
				{
					path: 'widget/:widgetId',
					name: 'page-add-new-widget',
					components: {
						addWidget: NewWidgetComponent,
					},
				},
			],
		},
		{
			name: 'front-office-query',
			path: '/front-office/queries',
			component: QueriesComponent,
			children: [
				{
					path: '+',
					name: 'query-add-new',
					components: {
						add: NewQueryComponent,
					},
				},
			],
		},
		{
			name: 'query-details',
			path: '/front-office/queries/:id',
			component: QueryDetailsComponent,
		},
	],
});
