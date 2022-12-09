<template>
	<component
		:is="layoutWrapper"
		ref="layoutRef"
		v-slot="{ layoutState }"
		v-model:selection="selection"
		v-model:layout-options="layoutOptions"
		v-model:layout-query="layoutQuery"
		:search="search"
		:filter="filter"
		:collection="collection"
		:reset-preset="resetPreset"
		:clear-filters="clearFilters"
	>
		<private-view :title="collectionConfig.title">
			<template #headline>
				<v-breadcrumb :items="[{ name: 'Ledger', to: '/ledger' }]" />
			</template>

			<template #title-outer:prepend>
				<div class="position-relative">
					<v-button class="header-icon" rounded disabled icon secondary>
						<v-icon :name="collectionConfig.icon" />
					</v-button>
					<connection />
				</div>
			</template>

			<template #actions:prepend>
				<component :is="`layout-actions-tabular`" v-bind="layoutState" />
			</template>

			<template #actions>
				<search-input
					:filter="filter"
					:model-value="search"
					:collection="collection"
					@update:filter="onFilterInput"
					@update:model-value="onSearchInput"
				/>

				<v-dialog v-if="selection.length > 0 && endbleCURD" v-model="confirmDelete" @esc="confirmDelete = false">
					<template #activator="{ on }">
						<v-button
							v-tooltip.bottom="isAdmin ? t('delete_label') : t('not_allowed')"
							:disabled="!isAdmin"
							rounded
							icon
							class="action-delete"
							secondary
							@click="on"
						>
							<v-icon name="delete" outline />
						</v-button>
					</template>

					<v-card>
						<v-card-title>{{ t('batch_delete_confirm', selection.length) }}</v-card-title>

						<v-card-actions>
							<v-button secondary @click="confirmDelete = false">
								{{ t('cancel') }}
							</v-button>
							<v-button kind="danger" :loading="deleting" @click="batchDelete">
								{{ t('delete_label') }}
							</v-button>
						</v-card-actions>
					</v-card>
				</v-dialog>

				<v-button
					v-if="endbleCURD"
					v-tooltip.bottom="`Create New Collection`"
					rounded
					icon
					:to="`/ledger/${collectionConfig.path}/+`"
					:disabled="!isAdmin"
				>
					<v-icon name="add" />
				</v-button>
			</template>

			<template #navigation>
				<navigation></navigation>
			</template>

			<div class="padding-box">
				<component :is="`layout-${layout || 'tabular'}`" v-bind="layoutState" :on-row-click="onRowClick" class="layout">
					<template #no-results>
						<v-info :title="t('no_results')" icon="search" center>
							{{ t('no_results_copy') }}
						</v-info>
					</template>

					<template #no-items>
						<v-info :title="t('item_count', 0)" :icon="currentCollection.icon" center>
							{{ t('no_items_copy') }}

							<template v-if="endbleCURD" #append>
								<v-button :to="`/ledger/${collectionConfig.path}/+`">{{ t('create_item') }}</v-button>
							</template>
						</v-info>
					</template>
				</component>
			</div>
		</private-view>
	</component>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { Ref, ref, watch, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLayout, useCollection } from '@directus/shared/composables';
import { useApi } from '@directus/extensions-sdk';
import { usePreset } from '../composables/use-preset';
import Navigation from '../components/navigation.vue';
import SearchInput from '../components/search-input.vue';
import { useStores } from '@directus/extensions-sdk';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import Connection from '../components/connection.vue';
import { collectionConfigList } from '../constants/index';

export default {
	components: {
		Navigation,
		SearchInput,
		Connection,
	},
	setup() {
		const { t } = useI18n();
		const router = useRouter();
		const route = useRoute();
		const api = useApi();
		const { useUserStore } = useStores();
		const { isAdmin } = useUserStore();

		const selection = ref([]);
		const collection: Ref<string> = ref(route.params?.collection as string);
		const layoutRef = ref<HTMLElement | null>(null);

		const { layout, layoutOptions, layoutQuery, filter, search, resetPreset } = usePreset(collection);
		const { layoutWrapper } = useLayout(layout);
		const { info: currentCollection, primaryKeyField } = useCollection(collection);

		const { confirmDelete, deleting, batchDelete } = useBatch();

		watch(
			() => route.params,
			(val: any) => {
				collection.value = !isEmpty(val?.collection) ? val?.collection : collection.value;
			}
		);

		const endbleCURD = computed(() => collection.value !== 'cms_ledger_docs');
		const collectionConfig = computed(() => collectionConfigList[collection.value]);

		const onRowClick = ({ item, event }) => {
			if (!primaryKeyField.value) return;

			const primaryKey: any = item[primaryKeyField.value.field];

			if (selection.value?.length > 0) {
				if (selection.value?.includes(primaryKey) === false) {
					selection.value = selection.value.concat(primaryKey);
				} else {
					selection.value = selection.value.filter((item) => item !== primaryKey);
				}
			} else {
				const next = router.resolve(`/ledger/${collectionConfig.value.path}/${encodeURIComponent(primaryKey)}`);

				if (event.ctrlKey || event.metaKey) window.open(next.href, '_blank');
				else router.push(next);
			}
		};

		const onSearchInput = debounce(async (val) => {
			search.value = val;
		}, 0);

		const onFilterInput = debounce(async (val) => {
			filter.value = val;
		}, 0);

		const clearFilters = () => {
			filter.value = null;
			search.value = null;
		};

		function useBatch() {
			const confirmDelete = ref(false);
			const deleting = ref(false);

			const error = ref<any>(null);

			return { confirmDelete, deleting, batchDelete, error };

			async function batchDelete() {
				deleting.value = true;

				const batchPrimaryKeys = selection.value;

				try {
					await api.delete(`/items/${collectionConfig.value.endpoint}`, {
						data: batchPrimaryKeys,
					});

					selection.value = [];
					await refresh();

					confirmDelete.value = false;
				} catch (err: any) {
					error.value = err;
				} finally {
					deleting.value = false;
				}
			}
		}

		async function refresh() {
			await layoutRef.value?.state?.refresh?.();
		}

		onMounted(() => {
			layoutQuery.value.sort = collection.value === 'cms_ledger_docs' ? ['created_at'] : null;
		});

		return {
			t,
			search,
			filter,
			layout,
			isAdmin,
			selection,
			collection,
			layoutWrapper,
			endbleCURD,
			onSearchInput,
			onFilterInput,
			currentCollection,
			onRowClick,
			layoutOptions,
			layoutQuery,
			resetPreset,
			clearFilters,
			layoutRef,
			confirmDelete,
			deleting,
			batchDelete,
			collectionConfig,
		};
	},
};
</script>

<style>
.padding-box {
	padding: var(--content-padding);
}
.position-relative {
	position: relative;
}
</style>
