import { defineModule } from '@directus/extensions-sdk';
import NotFound from './routes/not-found.vue';
import ImportComponent from './routes/import.vue';
import ExportComponent from './routes/export.vue';
import ImportDetailComponent from './routes/import-detail.vue';
import ExportDetailComponent from './routes/export-detail.vue';
import RoutePass from './utils/router-passthrough';

export default defineModule({
	id: 'data-management',
	name: 'Data management',
	icon: 'import_export',
	routes: [
		{
			path: '',
			redirect: '/import',
		},
		{
			path: '/import',
			component: RoutePass,
			children: [
				{
					path: '',
					component: ImportComponent,
				},
				{
					path: ':collection',
					component: ImportDetailComponent,
				},
			],
		},
		{
			path: '/export',
			component: ExportComponent,
		},
		{
			path: '/export/:collection',
			component: ExportDetailComponent,
		},
		{
			name: 'data-management-not-found',
			path: ':_(.+)+',
			component: NotFound,
		},
	],
});
