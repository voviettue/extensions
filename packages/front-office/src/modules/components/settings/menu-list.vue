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
				<menu-item
					:menu="element"
					:menu-list="itemMenus"
					@refresh="$emit('refresh')"
					@set-nested-sort="setNestedSort"
				/>
			</template>
		</draggable>

		<v-button class="add-new" half-width :to="`/front-office/settings/project/${primaryKey}/menu/+`">
			Create New
		</v-button>
	</div>
	<router-view name="add_menu" @close="$emit('refresh')"></router-view>
</template>

<script lang="ts">
import { ref, watch } from 'vue';

import { useApi } from '@directus/extensions-sdk';
import MenuItem from './menu-item.vue';
import Draggable from 'vuedraggable';
import cloneDeep from 'lodash/cloneDeep';

export default {
	components: { Draggable, MenuItem },
	props: {
		menus: {
			type: Array,
			default: null,
		},
		primaryKey: {
			type: [String, Number],
			required: true,
		},
	},
	emits: ['refresh'],
	setup(props, { emit }) {
		const collection = 'cms_menus';
		const api = useApi();
		const itemMenus = ref();

		watch(
			() => props.menus,
			() => {
				itemMenus.value = cloneDeep(props.menus || []).sort((a: any, b: any) => (a.sort ?? 1000) - (b.sort ?? 1000));
			},
			{ immediate: true }
		);

		return { itemMenus, setSort, setNestedSort, close };

		async function setSort(values: any) {
			itemMenus.value = values.map((item: any, index: number) => {
				return {
					id: item.id,
					sort: index,
					parent: null,
				};
			});
			await massUpdate(itemMenus.value);
		}

		async function setNestedSort(updates: any) {
			await massUpdate(updates);
		}

		async function massUpdate(values: any) {
			const apis = values.map((k: any) => {
				return api.patch(`/items/${collection}/${k.id}`, k);
			});
			await Promise.allSettled(apis);

			emit('refresh');
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
