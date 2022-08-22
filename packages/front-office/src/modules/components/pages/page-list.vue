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
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import Draggable from 'vuedraggable';
import PageItem from './page-item.vue';
const route = useRoute();
const api = useApi();
const items = ref([]);
async function getListPage() {
	try {
		const res = await api.get('/items/cms_pages');
		items.value = (res?.data?.data || []).sort((a, b) => (a.sort ?? 1000) - (b.sort ?? 1000));
	} catch {
		//
	}
}
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
}
watch(
	() => route.name,
	(val) => {
		if (val === 'front-office-page') getListPage();
	}
);
async function updateVisiable(page) {
	try {
		await api.patch(`/items/cms_pages/${page.id}`, { hidden: !page.hidden });
		getListPage();
	} catch {
		//
	}
}
async function deletePage(page) {
	try {
		await api.delete(`/items/cms_pages/${page.id}`);
		getListPage();
	} catch {
		//
	}
}
onMounted(() => {
	getListPage();
});
</script>
