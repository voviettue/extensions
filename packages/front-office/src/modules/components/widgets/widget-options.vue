<template>
	<div>
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

				<v-list-item v-if="isAdmin" clickable class="danger" @click="deleteDialog = true">
					<v-list-item-icon>
						<v-icon name="delete" />
					</v-list-item-icon>
					<v-list-item-content>Delete widget</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-menu>
		<v-dialog v-model="deleteDialog" @esc="deleteDialog = false">
			<v-card>
				<v-card-title>
					{{ `Are you sure you want to delete this widget "${widget.name}"? This action can not be undone.` }}
				</v-card-title>
				<v-card-actions>
					<v-button secondary @click="deleteDialog = false">Cancel</v-button>
					<v-button :loading="deleting" kind="danger" @click="deleteWidget(widget)">Delete</v-button>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>
<script setup lang="ts">
import { Ref, ref } from 'vue';
import { useStores } from '@directus/extensions-sdk';
const { useUserStore } = useStores();
const { isAdmin } = useUserStore();
withDefaults(defineProps<{ widget: Record<string, any>; updateVisiable: () => void; deleteWidget: () => void }>(), {
	widget: () => ({
		custom_css: null,
		hidden: false,
		html_class: null,
		id: 1,
		name: '',
		options: null,
		parent: null,
		sort: null,
		widget: null,
		width: 'full',
	}),
});

const deleteDialog: Ref<boolean> = ref(false);
</script>
<style scoped>
.v-list-item.danger {
	--v-list-item-color: var(--danger);
	--v-list-item-color-hover: var(--danger);
	--v-list-item-icon-color: var(--danger);
}
</style>
