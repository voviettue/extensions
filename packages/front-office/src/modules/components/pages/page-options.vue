<template>
	<div>
		<v-menu show-arrow placement="bottom-end">
			<template #activator="{ toggle }">
				<v-icon name="more_vert" clickable class="ctx-toggle" @click.prevent="toggle" />
			</template>
			<v-list>
				<!-- <v-list-item v-if="page.id" clickable :to="`/front-office/pages/${page.id}`">
					<v-list-item-icon>
						<v-icon name="box" />
					</v-list-item-icon>
					<v-list-item-content>View content</v-list-item-content>
				</v-list-item> -->

				<v-list-item v-if="isAdmin" clickable @click="updateVisiable(page)">
					<template v-if="page.hidden === true">
						<v-list-item-icon><v-icon name="visibility_off" /></v-list-item-icon>
						<v-list-item-content>Make Collection Visible</v-list-item-content>
					</template>
					<template v-else>
						<v-list-item-icon><v-icon name="visibility" /></v-list-item-icon>
						<v-list-item-content>Make Collection Hidden</v-list-item-content>
					</template>
				</v-list-item>

				<v-list-item v-if="isAdmin" clickable class="danger" @click="deleteDialog = true">
					<v-list-item-icon>
						<v-icon name="delete" />
					</v-list-item-icon>
					<v-list-item-content>Delete Page</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-menu>
		<v-dialog v-model="deleteDialog" @esc="deleteDialog = false">
			<v-card>
				<v-card-title>
					{{ `Are you sure you want to delete this menu "${page.title}"? This action can not be undone.` }}
				</v-card-title>
				<v-card-actions>
					<v-button secondary @click="deleteDialog = false">Cancel</v-button>
					<v-button :loading="deleting" kind="danger" @click="deletePage(page)">Delete</v-button>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>
<script setup lang="ts">
import { useStores } from '@directus/extensions-sdk';
import { Ref, ref } from 'vue';
const { useUserStore } = useStores();
const { isAdmin } = useUserStore();
withDefaults(defineProps<{ page: Record<string, any>; updateVisiable: Function; deletePage: Function }>(), {
	page: () => ({
		endpoint: '',
		hidden: false,
		id: null,
		key: '',
		title: '',
	}),
});
const deleteDialog: Ref<boolean> = ref(false);
</script>
<style scoped>
.ctx-toggle {
	position: absolute !important;
	top: 7px;
	right: 20px;
}
.danger {
	color: red;
}
</style>
