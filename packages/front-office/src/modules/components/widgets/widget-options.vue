<template>
	<div v-if="isAdmin">
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

				<v-list-item v-if="allowCreateTab" clickable @click="createTab">
					<v-list-item-icon>
						<v-icon name="add" />
					</v-list-item-icon>
					<v-list-item-content>Create Tab</v-list-item-content>
				</v-list-item>

				<v-list-item v-if="allowCreateWidget" clickable @click="createChildrenWidget">
					<v-list-item-icon>
						<v-icon name="add" />
					</v-list-item-icon>
					<v-list-item-content>Create widget</v-list-item-content>
				</v-list-item>

				<v-list-item clickable @click="toggleHidden">
					<template v-if="widget.hidden === true">
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

				<v-divider />

				<v-list-item clickable @click="duplicate">
					<v-list-item-icon>
						<v-icon name="content_copy" />
					</v-list-item-icon>
					<v-list-item-content>Duplicate</v-list-item-content>
				</v-list-item>

				<v-list-item v-if="allowCopy" clickable @click="copy">
					<v-list-item-icon>
						<v-icon name="content_copy" />
					</v-list-item-icon>
					<v-list-item-content>Copy</v-list-item-content>
				</v-list-item>

				<v-divider />

				<v-list-item clickable class="danger" @click="deleteDialog = true">
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
					{{ `Are you sure you want to delete this widget "${widget.name}"? This action can not be undone.` }}
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
import { ref } from 'vue';
import { useStores } from '@directus/extensions-sdk';
import { useRouter } from 'vue-router';
import { Widget } from '../../types';
import { useNotification } from '../../composables/use-notification';
import cloneDeep from 'lodash/cloneDeep';
import { useWidgetStore } from '../../stores/widget';
import { storeToRefs } from 'pinia';

interface Props {
	widget: Widget;
}

const props = defineProps<Props>();
const { useUserStore } = useStores();
const store = useWidgetStore();
const router = useRouter();
const { isAdmin } = useUserStore();
const { copyId } = storeToRefs(store);
const { notify, unexpectedError } = useNotification();

const deleteDialog = ref(false);
const allowCreateTab = props.widget?.widget === 'tabs';
const allowCopy = props.widget?.widget !== 'tab';
const allowCreateWidget = ['container', 'list', 'tab', 'form', 'modal'].includes(props.widget?.widget);

async function toggleHidden() {
	await store.update(props.widget.id, { hidden: !props.widget.hidden });
	notify({ title: 'Item updated' });
	await store.hydrate(props.widget.page);
}

async function deleteHandler() {
	await store.delete(props.widget.id);
	notify({ title: 'Item deleted' });
	await store.hydrate(props.widget.page);
}

async function duplicate() {
	try {
		await store.duplicate(props.widget);
		await store.hydrate(props.widget.page);
		notify({ title: 'Item duplicated' });
	} catch (err) {
		unexpectedError(err);
	}
}

function copy() {
	copyId.value = props.widget.id;
	notify({ title: 'Item copied' });
}

function createChildrenWidget() {
	return router.push(`/front-office/pages/${props.widget.page}/widget/+/${props.widget.id}`);
}

async function createTab() {
	const payload = {
		name: 'New Tab',
		width: 'full',
		widget: 'tab',
		options: {
			label: 'New Tab',
		},
		parent: props.widget.id,
		page: props.widget.page,
	};
	const tab = await store.create(payload);
	await store.update(tab.id, { key: `${props.widget.key}_tab_${tab.id}` });
	notify({ title: 'Item created' });
	store.hydrate(props.widget.page);
}
</script>

<style scoped>
.v-list-item.danger {
	--v-list-item-color: var(--danger);
	--v-list-item-color-hover: var(--danger);
	--v-list-item-icon-color: var(--danger);
}
</style>
