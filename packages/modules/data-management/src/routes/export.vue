<template>
	<private-view title="Export Data">
		<template #headline>
			<v-breadcrumb :items="[{ name: 'Data Management', to: '/data-management/export' }]" />
		</template>

		<template #title-outer:prepend>
			<v-button class="header-icon" rounded disabled icon secondary>
				<v-icon name="file_download" />
			</v-button>
		</template>

		<template #navigation>
			<navigation></navigation>
		</template>

		<div class="padding-box">
			<v-info v-if="collections.length === 0" type="warning" icon="box" :title="t('no_collections')">
				{{ t('no_collections_copy_admin') }}
				<template #append>
					<v-button to="/settings/data-model/+">{{ t('create_collection') }}</v-button>
				</template>
			</v-info>

			<v-list v-else>
				<v-list-item
					v-for="collection of collections"
					:key="collection.collection"
					class="collection-row hidden dense half"
					clickable
					block
					:disabled="!createAllowed(collection)"
					@click="onClickCollection(collection)"
				>
					<v-list-item-icon>
						<v-icon :name="collection.meta.icon || 'label'" :color="collection.meta.color" />
					</v-list-item-icon>

					<span class="collection-name">
						{{ formatTitle(collection.name) }}
					</span>
				</v-list-item>
			</v-list>
		</div>
	</private-view>
</template>

<script>
import { inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Navigation from '../components/navigation.vue';
import formatTitle from '@directus/format-title';

export default {
	components: { Navigation },
	inject: ['api'],
	setup() {
		const stores = inject('stores');
		const router = useRouter();
		const collectionStore = stores.useCollectionsStore();
		const userStore = stores.useUserStore();
		const permissionsStore = stores.usePermissionsStore();
		const collections = collectionStore.visibleCollections.filter((e) => e.type !== 'alias');
		const { t } = useI18n();

		return {
			t,
			collections,
			formatTitle,
			onClickCollection,
			createAllowed,
		};

		function onClickCollection(collection) {
			router.push(`/export/${collection.collection}`);
		}

		function createAllowed(collection) {
			const admin = userStore?.currentUser?.role.admin_access === true;
			if (admin) return true;

			const createPermissions = permissionsStore.permissions.find(
				(permission) => permission.action === 'create' && permission.collection === collection.collection
			);
			return !!createPermissions;
		}
	},
};
</script>

<style>
.padding-box {
	padding: var(--content-padding);
	padding-top: 0;
}

.collection-icon {
	margin-right: 8px;
}
</style>
