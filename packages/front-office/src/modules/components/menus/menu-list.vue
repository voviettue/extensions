<template>
	<div class="grid menus-management">
		<v-info v-if="menus.length === 0" icon="menu" title="No Menu">
			<template #append>
				<v-button to="/front-office/menus/+">Create Menu</v-button>
			</template>
		</v-info>
		<draggable
			class="menu-grid"
			:model-value="menus.filter((item) => item?.parent == null)"
			:item-key="`id`"
			:force-fallback="true"
			handle=".drag-handle"
			:group="{ name: 'setting-menus' }"
			:animation="150"
			:fallback-on-body="true"
			:invert-swap="true"
			@update:model-value="setSort"
		>
			<template #item="{ element }">
				<menu-item :menu="element" @refresh="refresh" @set-nested-sort="setNestedSort" />
			</template>
		</draggable>
	</div>
	<router-view name="menu_detail" :project-id="projectId" @refresh="refresh"></router-view>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import MenuItem from './menu-item.vue';
import Draggable from 'vuedraggable';
import { useFrontOfficeStore } from '../../stores/front-office';

defineProps<{
	projectId: number;
}>();

const store = useFrontOfficeStore();
const { menus } = storeToRefs(store);

async function setSort(values: any) {
	const updates = values.map((item: any, index: number) => {
		return {
			...item,
			sort: index,
			parent: null,
		};
	});
	await store.updateMenus(updates);
	await refresh();
}

async function setNestedSort(updates: any) {
	await store.updateMenus(updates);
	await refresh();
}

async function refresh() {
	await store.hydrateMenus();
}
</script>

<style lang="scss" scoped>
.menus-management {
	padding: var(--content-padding);
	padding-bottom: 0;
	max-width: 800px;

	.name {
		margin-bottom: 12px;
		.instant-save {
			margin-left: 4px;
			color: var(--warning);
		}
	}
}

.menu-grid {
	position: relative;
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
}

.add-new {
	margin-top: 20px;
	margin-bottom: 20px;
}
</style>
