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

				<v-list-item v-if="isAdmin && allowCreateChild" clickable @click="createChildrenWidget">
					<v-list-item-icon>
						<v-icon name="add" />
					</v-list-item-icon>
					<v-list-item-content>Create widget</v-list-item-content>
				</v-list-item>

				<v-list-item v-if="isAdmin" clickable @click="toggleHidden">
					<template v-if="widget.hidden === true">
						<v-list-item-icon><v-icon name="visibility_off" /></v-list-item-icon>
						<v-list-item-content>Make Visible</v-list-item-content>
					</template>
					<template v-else>
						<v-list-item-icon><v-icon name="visibility" /></v-list-item-icon>
						<v-list-item-content>Make Hidden</v-list-item-content>
					</template>
				</v-list-item>

				<v-list-item v-if="isAdmin" clickable @click="duplicate">
					<v-list-item-icon>
						<v-icon name="content_copy" />
					</v-list-item-icon>
					<v-list-item-content>Duplicate</v-list-item-content>
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
import { useFrontOfficeStore } from '../../stores/front-office';
import { useStores } from '@directus/extensions-sdk';
import { useRouter } from 'vue-router';
import { Widget } from '../../types';
import { useNotification } from '../../composables/use-notification';
import cloneDeep from 'lodash/cloneDeep';

interface Props {
	widget: Widget;
}

const props = defineProps<Props>();
const { useUserStore } = useStores();
const store = useFrontOfficeStore();
const router = useRouter();
const { isAdmin } = useUserStore();
const { notify, unexpectedError } = useNotification();

const deleteDialog = ref(false);
const allowCreateChild = ['container', 'list', 'tab', 'form', 'modal'].includes(props.widget?.widget);

async function toggleHidden() {
	await store.updateWidget(props.widget.id, { hidden: !props.widget.hidden });
	notify({ title: 'Item updated' });
	await store.hydrateWidgets(props.widget.page);
}

async function deleteHandler() {
	await store.deleteWidget(props.widget.id);
	notify({ title: 'Item deleted' });
	await store.hydrateWidgets(props.widget.page);
}

async function duplicate() {
	try {
		await cloneWidget(props.widget, props.widget.parent);
		await store.hydrateWidgets(props.widget.page);
		notify({ title: 'Item copied' });
	} catch (err) {
		unexpectedError(err);
	}
}

async function cloneWidget(widget, parent, index = 0) {
	index++;
	try {
		const payload = cloneDeep(widget);
		delete payload['id'];
		payload.name += ' (Copy)';
		payload.sort = payload.sort ?? null;
		payload.parent = parent;
		const key = `${payload.key}_${index}`;

		const clonedWidget = await store.createWidget({ ...payload, key });
		await cloneChildren(widget, clonedWidget.id, index);
	} catch (err: any) {
		const code = err?.response?.data?.errors?.[0]?.extensions?.code;
		if (code === 'RECORD_NOT_UNIQUE' && index <= 10) {
			return await cloneWidget(widget, parent, index);
		}

		throw Error('An occur error when trying to duplicate widget.');
	}
}

async function cloneChildren(widget: Widget, parent, index) {
	const childWidgets = store.widgets.filter((item: any) => {
		return item.parent === widget.id;
	});

	for (const childWidget of childWidgets) {
		await cloneWidget(childWidget, parent, index);
	}
}

function createChildrenWidget() {
	return router.push(`/front-office/pages/${props.widget.page}/widget/+/${props.widget.id}`);
}
</script>

<style scoped>
.v-list-item.danger {
	--v-list-item-color: var(--danger);
	--v-list-item-color-hover: var(--danger);
	--v-list-item-icon-color: var(--danger);
}
</style>
