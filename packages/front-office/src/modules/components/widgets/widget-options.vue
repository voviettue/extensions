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

				<v-list-item v-if="isAdmin && widget?.page && widget.widget !== 'tabs'" clickable @click="createChildrenWidget">
					<v-list-item-icon>
						<v-icon name="add" />
					</v-list-item-icon>
					<v-list-item-content>Create widget</v-list-item-content>
				</v-list-item>

				<v-list-item v-if="isAdmin" clickable @click="updateVisiable(widget)">
					<template v-if="widget.hidden === true">
						<v-list-item-icon><v-icon name="visibility_off" /></v-list-item-icon>
						<v-list-item-content>Make Visible</v-list-item-content>
					</template>
					<template v-else>
						<v-list-item-icon><v-icon name="visibility" /></v-list-item-icon>
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
					{{ `Are you sure you want to delete this widget "${widgetName}"? This action can not be undone.` }}
				</v-card-title>
				<v-card-actions>
					<v-button secondary @click="deleteDialog = false">Cancel</v-button>
					<v-button kind="danger" @click="deleteWidget(widget)">Delete</v-button>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>
<script setup lang="ts">
import { Ref, ref, computed } from 'vue';
import { useStores } from '@directus/extensions-sdk';
import { useRouter } from 'vue-router';

const { useUserStore } = useStores();
const { isAdmin } = useUserStore();
const router = useRouter();

const props = withDefaults(
	defineProps<{
		widget: Record<string, any>;
		updateVisiable: (widget: any) => void;
		deleteWidget: (widget: any) => void;
	}>(),
	{
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
	}
);

function createChildrenWidget() {
	if (props.widget.widget === 'tab') {
		return router.push(
			`/front-office/pages/${props.widget.page}/widget/+/${props.widget.parent}?tab=${props.widget.key}`
		);
	}

	return router.push(`/front-office/pages/${props.widget.page}/widget/+/${props.widget.id}`);
}

const deleteDialog: Ref<boolean> = ref(false);
const widgetName = computed(() => props.widget?.name || props.widget?.label);
</script>
<style scoped>
.v-list-item.danger {
	--v-list-item-color: var(--danger);
	--v-list-item-color-hover: var(--danger);
	--v-list-item-icon-color: var(--danger);
}
</style>
