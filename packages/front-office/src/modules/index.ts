import { defineModule } from '@directus/extensions-sdk';
import ModuleComponent from './routes/module.vue';
import MenuComponent from './routes/menu.vue';
import SettingComponent from './routes/setting.vue';
import PagesComponent from './routes/pages.vue';
import QueriesComponent from './routes/queries.vue';
import NewPageComponent from './components/pages/page-create.vue';
import PageDetailComponent from './components/pages/page-detail.vue';
import NewQueryComponent from './components/queries/query-create.vue';
import QueryDetailsComponent from './components/queries/query-details.vue';
import NewWidgetComponent from './components/widgets/widget-create.vue';
import MenuDetailComponent from './components/menus/menu-detail.vue';

export default defineModule({
	id: 'front-office',
	name: 'App Builder',
	icon: 'web',
	routes: [
		{
			path: '/front-office',
			component: ModuleComponent,
			redirect: '/front-office/pages',
			children: [
				{
					path: 'settings',
					component: SettingComponent,
					children: [
						{
							path: 'project/:projectId/menu/:menuId',
							name: 'setting-menu-detail',
							components: {
								menu_detail: MenuDetailComponent,
							},
						},
					],
				},
				{
					path: 'menus',
					component: MenuComponent,
					children: [
						{
							path: ':id',
							name: 'setting-menu-detail',
							components: {
								menu_detail: MenuDetailComponent,
							},
						},
					],
				},
				{
					name: 'front-office-page',
					path: 'pages',
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
					path: 'pages/:id',
					component: PageDetailComponent,
					children: [
						{
							path: 'widget/:widgetId',
							name: 'page-add-new-widget',
							components: {
								addWidget: NewWidgetComponent,
							},
						},
						{
							path: 'widget/:widgetId/:parentId',
							name: 'page-add-children-widget',
							components: {
								addWidget: NewWidgetComponent,
							},
						},
					],
				},
				{
					name: 'front-office-query',
					path: 'queries',
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
					path: 'queries/:id',
					component: QueryDetailsComponent,
				},
			],
		},
	],
});
