import { defineModule } from '@directus/extensions-sdk';
import NotFound from './routes/not-found.vue';
import Billing from './routes/billing.vue';

export default defineModule({
	id: 'workspace',
	name: 'Workspace Info',
	icon: 'workspaces',
	routes: [
		{
			path: '',
			redirect: '/workspace/billing',
		},
		{
			path: 'billing',
			component: Billing,
		},
		{
			name: 'workspace-not-found',
			path: ':_(.+)+',
			component: NotFound,
		},
	],
});
