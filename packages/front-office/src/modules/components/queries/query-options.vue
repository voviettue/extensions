<template>
	<div>
		<v-menu show-arrow placement="bottom-end">
			<template #activator="{ toggle }">
				<v-icon name="more_vert" clickable class="ctx-toggle" @click.prevent="toggle" />
			</template>
			<v-list>
				<v-list-item v-if="isAdmin" clickable class="danger" @click="deleteDialog = true">
					<v-list-item-icon>
						<v-icon name="delete" />
					</v-list-item-icon>
					<v-list-item-content>Delete Query</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-menu>
		<v-dialog v-model="deleteDialog" @esc="deleteDialog = false">
			<v-card>
				<v-card-title>
					{{
						`Are you sure you want to delete the query "${query.name}"? This will delete the query and all components in it. This action is permanent.`
					}}
				</v-card-title>
				<v-card-actions>
					<v-button secondary @click="deleteDialog = false">Cancel</v-button>
					<v-button :loading="deleting" kind="danger" @click="deleteQuery()">Delete</v-button>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>
<script setup lang="ts">
import { useStores } from '@directus/extensions-sdk';
import { useRoute } from 'vue-router';
import { useItem } from '../../composables/use-item';
import { Ref, ref } from 'vue';

const emit = defineEmits(['refresh']);
withDefaults(defineProps<{ query: Record<string, any> }>(), {
	query: () => ({
		id: null,
		name: '',
		options: null,
		output: null,
		query: null,
	}),
});

const { useUserStore } = useStores();
const { isAdmin } = useUserStore();
const route = useRoute();

const primaryKey = route.params.id as string;
const { deleting, remove } = useItem('cms_queries', primaryKey);

async function deleteQuery() {
	await remove();
	emit('refresh');
}

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
