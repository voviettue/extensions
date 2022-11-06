<template>
	<div>
		<v-menu show-arrow placement="bottom-end">
			<template #activator="{ toggle }">
				<v-icon name="more_vert" clickable @click.prevent="toggle" />
			</template>
			<v-list>
				<v-list-item v-if="isAdmin" clickable @click="createWidget">
					<v-list-item-icon>
						<v-icon name="add" />
					</v-list-item-icon>
					<v-list-item-content>Create widget</v-list-item-content>
				</v-list-item>

				<v-list-item v-if="isAdmin" clickable @click="toggleHidden">
					<template v-if="tab.hidden === true">
						<v-list-item-icon>
							<v-icon name="visibility_off" />
						</v-list-item-icon>
						<v-list-item-content>Make Visible</v-list-item-content>
					</template>
					<template v-else>
						<v-list-item-icon>
							<v-icon name="visibility" />
						</v-list-item-icon>
						<v-list-item-content>Make Hidden</v-list-item-content>
					</template>
				</v-list-item>

				<v-list-item v-if="isAdmin" clickable class="danger" @click="deleteDialog = true">
					<v-list-item-icon>
						<v-icon name="delete" />
					</v-list-item-icon>
					<v-list-item-content>Delete</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-menu>
		<v-dialog v-model="deleteDialog" @esc="deleteDialog = false">
			<v-card>
				<v-card-title>
					{{ `Are you sure you want to delete this tab "${tab.label}"? This action can not be undone.` }}
				</v-card-title>
				<v-card-actions>
					<v-button secondary @click="deleteDialog = false">Cancel</v-button>
					<v-button kind="danger" @click="deleteHandler">Delete</v-button>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>
<script setup lang="ts">
import { Ref, ref } from 'vue';
import { useStores } from '@directus/extensions-sdk';
import { useRouter } from 'vue-router';
import { Widget, Tab } from '../../types';
import { useNotification } from '../../composables/use-notification';

interface Props {
	widget: Widget;
	tab: Tab;
}

const props = defineProps<Props>();
const emit = defineEmits(['update', 'delete']);
const { useUserStore } = useStores();
const { isAdmin } = useUserStore();
const { notify } = useNotification();
const router = useRouter();
const deleteDialog: Ref<boolean> = ref(false);

function createWidget() {
	return router.push(`/front-office/pages/${props.widget.page}/widget/+/${props.widget.id}?tab=${props.tab.key}`);
}

function toggleHidden() {
	const hidden = props.tab.hidden ?? false;
	emit('update', { ...props.tab, hidden: !hidden });
	notify({ title: 'Item updated!' });
}

function deleteHandler() {
	emit('delete', props.tab);
}
</script>

<style scoped>
.v-list-item.danger {
	--v-list-item-color: var(--danger);
	--v-list-item-color-hover: var(--danger);
	--v-list-item-icon-color: var(--danger);
}
</style>
