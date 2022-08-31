<template>
	<v-menu show-arrow placement="bottom-end">
		<template #activator="{ toggle }">
			<v-icon name="more_vert" clickable @click.prevent="toggle" />
		</template>
		<v-list>
			<v-list-item v-if="widget.id" :clickable="false" :to="`/front-office/pages/${widget.page}/widget/${widget.id}`">
				<v-list-item-icon>
					<v-icon name="box" />
				</v-list-item-icon>
				<v-list-item-content>View content</v-list-item-content>
			</v-list-item>

			<v-list-item v-if="isAdmin" clickable @click="updateVisiable(widget)">
				<template v-if="widget.hidden === true">
					<v-list-item-icon><v-icon name="visibility_off" /></v-list-item-icon>
					<v-list-item-content>Make Widget Visible</v-list-item-content>
				</template>
				<template v-else>
					<v-list-item-icon><v-icon name="visibility" /></v-list-item-icon>
					<v-list-item-content>Make Widget Hidden</v-list-item-content>
				</template>
			</v-list-item>

			<v-list-item v-if="isAdmin" clickable class="danger" @click="deleteWidget(widget)">
				<v-list-item-icon>
					<v-icon name="delete" />
				</v-list-item-icon>
				<v-list-item-content>Delete widget</v-list-item-content>
			</v-list-item>
		</v-list>
	</v-menu>
</template>
<script setup lang="ts">
import { useStores } from '@directus/extensions-sdk';
const { useUserStore } = useStores();
const { isAdmin } = useUserStore();
withDefaults(defineProps<{ widget: Record<string, any>; updateVisiable: () => void; deleteWidget: () => void }>(), {
	widget: () => ({
		customCss: null,
		hidden: false,
		htmlClass: null,
		id: 1,
		name: 'Test',
		options: null,
		parent: null,
		sort: null,
		widget: null,
		width: 'full',
	}),
});
</script>
<style scoped>
.v-list-item.danger {
	--v-list-item-color: var(--danger);
	--v-list-item-color-hover: var(--danger);
	--v-list-item-icon-color: var(--danger);
}
</style>
