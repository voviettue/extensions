import { defineModule } from '@directus/extensions-sdk';
import ModuleComponent from './routes/module.vue';
import CollectionCreateOrUpdateVue from './components/collections/collection-create-or-update.vue';
import DocDetailsComponent from './components/docs/doc-details.vue';
import CollectionComponent from './routes/collection.vue';

const beforeEnter = (to: any, from: any) => {
	if (to.name.startsWith('collections')) {
		to.params.collection = 'cms_ledger_collections';
	}

	if (to.name.startsWith('documents')) {
		to.params.collection = 'cms_ledger_docs';
	}
};

export default defineModule({
	id: 'ledger',
	name: 'Ledger',
	icon: 'storage',
	routes: [
		{
			path: '/ledger',
			component: ModuleComponent,
			redirect: '/ledger/collections',
			children: [
				{
					name: 'collections',
					path: 'collections',
					component: CollectionComponent,
					beforeEnter: beforeEnter,
				},
				{
					path: 'collections/+',
					name: 'collections-add-new',
					component: CollectionCreateOrUpdateVue,
					beforeEnter: beforeEnter,
				},
				{
					name: 'collections-details',
					path: 'collections/:id',
					component: CollectionCreateOrUpdateVue,
					beforeEnter: beforeEnter,
				},
				{
					name: 'documents',
					path: 'documents',
					component: CollectionComponent,
					beforeEnter: beforeEnter,
				},
				{
					name: 'documents-details',
					path: 'documents/:id',
					component: DocDetailsComponent,
				},
			],
		},
	],
});
