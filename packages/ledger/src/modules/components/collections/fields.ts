import { useStores } from '@directus/extensions-sdk';

let selectedCollection: any = '';
let collectionsAllow: any = null;

export default defineCollection({
	id: 'collection',
	name: 'Collection',
	options: ({ values }) => {
		if (!collectionsAllow) {
			const { useCollectionsStore } = useStores();
			const collectionsStore = useCollectionsStore();

			const collections = collectionsStore.collections || [];
			collectionsAllow = collections.filter((collection: any) => collection?.meta && collection?.meta?.system !== true);
		}

		const collection = values.collection || '';

		if (!!selectedCollection && selectedCollection !== collection) {
			values.fields = undefined;
		}

		selectedCollection = collection;

		const options = [
			{
				field: 'collection',
				name: 'Collection',
				type: 'string',
				meta: {
					interface: 'select-dropdown',
					options: {
						choices: collectionsAllow?.map((e: any) => ({
							text: e.name,
							value: e.collection,
						})),
						allowOther: false,
					},
					readonly: !!values.id,
				},
			},
			{
				field: 'fields',
				type: 'json',
				name: 'Fields',
				meta: {
					width: 'full',
					interface: 'system-fields',
					required: true,
					options: {
						collectionName: selectedCollection,
						placeholder: 'Select review fields',
					},
				},
			},
		];

		return options;
	},
});

function defineCollection(config: any) {
	return config;
}
