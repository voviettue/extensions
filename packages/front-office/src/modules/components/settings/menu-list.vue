<template>
	<div class="grid menus-management">
		<div class="field-label type-label">
			<span class="field-name"><v-text-overflow text="Menu" /></span>
		</div>
		<draggable
			class="menu-grid"
			:model-value="itemMenus.filter((item) => item.parent == null)"
			:force-fallback="true"
			handle=".drag-handle"
			:group="{ name: 'setting-menus' }"
			:animation="150"
			:fallback-on-body="true"
			:invert-swap="true"
			@update:model-value="setSort"
		>
			<template #item="{ element }">
				<menu-item :menu="element" :menu-list="itemMenus" @refresh="refresh" @set-nested-sort="setNestedSort" />
			</template>
		</draggable>

		<v-button class="add-new" half-width :to="`/front-office/settings/project/${projectId}/menu/+`">
			Create New
		</v-button>
	</div>
	<router-view name="add_menu" @refresh="refresh"></router-view>
	<router-view name="update_menu" @refresh="refresh"></router-view>
</template>

<script lang="ts">
import { computed } from 'vue';

import MenuItem from './menu-item.vue';
import Draggable from 'vuedraggable';
import { useFrontOfficeStore } from '../../stores/front-office';

export default {
	components: { Draggable, MenuItem },
	props: {
		projectId: {
			type: [String, Number],
			required: true,
		},
	},
	setup() {
		const frontOfficeStore = useFrontOfficeStore();
		const itemMenus = computed(() => frontOfficeStore.menuList);

		return { itemMenus, setSort, setNestedSort, refresh };

		async function setSort(values: any) {
			const updates = values.map((item: any, index: number) => {
				return {
					...item,
					sort: index,
					parent: null,
				};
			});
			await frontOfficeStore.updateMenuItems(updates);
			await refresh();
		}

		async function setNestedSort(updates: any) {
			await frontOfficeStore.updateMenuItems(updates);
			await refresh();
		}

		async function refresh() {
			await frontOfficeStore.getMenuList();
		}
	},
};
</script>
<style lang="scss" scoped>
.menus-management {
	padding: var(--content-padding);
	padding-bottom: 0;
	max-width: 800px;

	.field-label {
		margin-bottom: 8px;
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
