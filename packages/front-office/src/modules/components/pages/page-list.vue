<template>
	<div>
		<v-info v-if="items.length === 0" icon="web" title="No Page">
			<template #append>
				<v-button to="/front-office/pages/+">Create Page</v-button>
			</template>
		</v-info>

		<v-list v-else class="draggable-list">
			<draggable
				:force-fallback="true"
				:model-value="items"
				:group="{ name: 'pages' }"
				:swap-threshold="0.3"
				class="root-drag-container"
				item-key="page"
				handle=".drag-handle"
				@update:model-value="onSort($event)"
			>
				<template #item="{ element }">
					<page-item :page="element" :update-visiable="updateVisiable" :delete-page="deletePage"></page-item>
				</template>
			</draggable>
		</v-list>
		<router-view name="add"></router-view>
	</div>
</template>
<script setup lang="ts">
import { useApi } from '@directus/extensions-sdk';
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import Draggable from 'vuedraggable';
import PageItem from './page-item.vue';
import { useNotification } from '../../composables/use-notification';
import { useFrontOfficeStore } from '../../stores/front-office';
import { storeToRefs } from 'pinia';

const route = useRoute();
const api = useApi();
const { notify } = useNotification();
const store = useFrontOfficeStore();
const { pages: items } = storeToRefs(store);

store.hydratePages();

watch(
	() => route.name,
	(val) => {
		if (val === 'front-office-page') store.hydratePages();
	}
);

async function onSort(val) {
	items.value = val.map((item, index) => {
		return {
			...item,
			sort: index,
		};
	});
	const apis = items.value.map((k: any) => {
		return api.patch(`/items/cms_pages/${k.id}`, k);
	});
	await Promise.allSettled(apis);
	await store.hydratePages();
}

async function updateVisiable(page) {
	try {
		await api.patch(`/items/cms_pages/${page.id}`, { hidden: !page.hidden });
		store.hydratePages();
	} catch {
		//
	}
}

async function deletePage(page) {
	try {
		await api.delete(`/items/cms_pages/${page.id}`);
		notify({ title: 'Item deleted' });
		store.hydratePages();
	} catch {
		//
	}
}
</script>
