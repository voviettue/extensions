<template>
	<div>
		<draggable
			class="widget-grid group full nested"
			:model-value="tabs"
			:force-fallback="true"
			handle=".drag-handle"
			:group="{ name: 'tabs' }"
			:animation="150"
			:fallback-on-body="true"
			:invert-swap="true"
			@update:model-value="updateOrderTab"
		>
			<template #header>
				<div class="header full">
					<v-icon class="drag-handle" name="drag_indicator" @click.stop />
					<v-icon v-if="!!config?.icon" class="drag-handle" :name="config.icon" @click.stop />
					<v-text-overflow class="name" :text="widget.name" />
					<v-icon v-if="widget.hidden" v-tooltip="`Hidden widget`" name="visibility_off" class="hidden-icon" small />
					<widget-options
						:widget="widget"
						:update-visiable="updateVisiable"
						:delete-widget="deleteWidget"
						class="option"
					/>
				</div>
			</template>

			<template #item="{ element }">
				<div class="widget-select grid-full">
					<widget-item-group
						:key="element.key"
						:widget="element"
						:list-widget="listWidget"
						:nested-widgets="getWidgetByIds(element.widgets)"
						:update-visiable="updateVisiable"
						:delete-widget="deleteWidget"
						:update-parent="(value) => updateParentTab(value, element)"
					>
						<template #header>
							<div class="header full">
								<v-icon class="drag-handle" name="drag_indicator" @click.stop />
								<v-text-overflow class="name" :text="element.label" />
								<v-icon
									v-if="element?.hidden"
									v-tooltip="`Hidden tab`"
									name="visibility_off"
									class="hidden-icon"
									small
								/>
								<widget-options
									:widget="element"
									:update-visiable="updateVisiableTab"
									:delete-widget="deleteTab"
									class="option"
								/>
							</div>
						</template>
					</widget-item-group>
				</div>
			</template>
		</draggable>
	</div>
</template>

<script setup lang="ts">
import { ref, Ref, watch, computed, defineEmits } from 'vue';
import WidgetItemGroup from './widget-item-group.vue';
import Draggable from 'vuedraggable';
import WidgetOptions from './widget-options.vue';
import formFields from '../../widgets';
import { useApi } from '@directus/extensions-sdk';
import { useRoute } from 'vue-router';
import { useNotification } from '../../composables/use-notification';
import remove from 'lodash/remove';

interface Props {
	widget: Record<string, any>;
	listWidget: Record<string, any>[];
	updateVisiable: (widget: any) => void;
	deleteWidget: (widget: any) => void;
	updateParent?: (widgets: any, el: any) => void;
}
const emit = defineEmits(['reload']);
const api = useApi();
const route = useRoute();

const { notify } = useNotification();
const props = withDefaults(defineProps<Props>(), {
	widget: () => ({
		custom_css: null,
		hidden: false,
		html_class: null,
		name: '',
		options: null,
		parent: null,
		sort: null,
		widget: null,
		width: 'full',
		page: null,
	}),
	updateParent: () => null,
});

const tabs: Ref<Record<string, any>[]> = ref(props.widget?.options?.tabs);

watch(
	() => route.name,
	async () => {
		const res = await api.get(`/items/cms_widgets/${props.widget.id}`);
		tabs.value = res?.data?.data?.options?.tabs;
	}
);

const config = computed(() => formFields.find((e) => e.id === props.widget.widget));

async function updateVisiableTab(tab) {
	const idx = tabs.value?.findIndex((e: any) => e.key === tab.key);
	tabs.value[idx].hidden = !tab?.hidden;
	try {
		await api.patch(`/items/cms_widgets/${props.widget.id}`, { options: { tabs: tabs.value } });
		emit('reload');
	} catch {
		//
	}
}

async function deleteTab(tab) {
	remove(tabs.value, (e: any) => e.key === tab.key);
	const widgets = props.listWidget?.filter((item) => tab?.widgets?.includes(item?.id));

	try {
		const apis = widgets.map((k: any) => {
			return api.delete(`/items/cms_widgets/${k.id}`);
		});
		await Promise.allSettled(apis);
		await api.patch(`/items/cms_widgets/${props.widget.id}`, { options: { tabs: tabs.value } });
		notify({ title: 'Items deleted' });
		emit('reload');
	} catch {
		//
	}
}

const getWidgetByIds = (ids: (string | number)[]) => {
	if (!ids) return [];

	return props.listWidget
		?.filter((item) => ids.includes(item?.id))
		.sort((a: any, b: any) => (a.sort ?? 1000) - (b.sort ?? 1000));
};

async function updateOrderTab(values: any) {
	try {
		const res = await api.patch(`/items/cms_widgets/${props.widget.id}`, { options: { tabs: values } });
		tabs.value = res?.data?.data?.options?.tabs;
		emit('reload');
	} catch {
		//
	}
}

async function updateParentTab(widgets, el) {
	const isValid = !widgets?.find((e: any) => !e?.widget);
	if (!isValid) return;

	const idWidgets = widgets?.map((e: any) => e?.id);
	const idx = tabs.value?.findIndex((e: any) => e.key === el.key);
	tabs.value[idx].widgets = idWidgets;

	const data = widgets?.map((item, index) => {
		return {
			id: item.id,
			sort: index,
			parent: props.widget.id,
		};
	});

	try {
		const apis = data.map((k: any) => {
			return api.patch(`/items/cms_widgets/${k.id}`, k);
		});
		await Promise.allSettled(apis);
		await api.patch(`/items/cms_widgets/${props.widget.id}`, { options: { tabs: tabs.value } });
		emit('reload');
	} catch {
		//
	}
}
</script>

<style scoped lang="scss">
.drag-handle {
	cursor: grab !important;
}

.widget-select {
	margin: 0px 4px;
}

.widget-select:deep(.widget-grid) {
	grid-gap: 10px;
}

.widget-select:deep(.widget-grid.group.full.nested) {
	// margin: 4px 0;

	.widget-select {
		margin: 0px 4px;
	}
}
.widget {
	height: 48px;

	:deep(.input) {
		border: var(--border-width) solid var(--border-subdued) !important;
		padding: 8px;
	}

	:deep(.input:hover) {
		background-color: var(--card-face-color) !important;
		border: var(--border-width) solid var(--border-normal-alt) !important;
	}

	.label {
		display: flex;
		flex-grow: 1;
		align-items: center;
		align-self: stretch;
		overflow: hidden;
		cursor: pointer;

		.label-inner {
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;

			.name {
				margin-right: 8px;
				margin-left: 8px;
				font-family: var(--family-monospace);
			}
		}
	}

	.type {
		color: var(--foreground-subdued);
		font-family: var(--family-monospace);
		transition: opacity var(--fast) var(--transition);
		opacity: 0;
	}
	&:hover .type {
		opacity: 1;
	}

	.icons {
		display: flex;
		align-items: center;
	}
}
.group {
	position: relative;
	min-height: var(--input-height);
	padding: var(--input-padding);
	padding-top: 40px;
	padding-bottom: 8px;
	border-radius: var(--border-radius);

	> * {
		position: relative;
		z-index: 2;
	}

	&::before {
		position: absolute;
		top: 0;
		left: -2px;
		z-index: 1;
		width: 4px;
		height: 100%;
		background-color: var(--primary);
		border-radius: 2px;
		content: '';
	}

	&::after {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		width: 100%;
		height: 100%;
		background-color: var(--primary);
		opacity: 0.1;
		content: '';
	}

	.header {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		width: 100%;
		margin-bottom: 8px;
		padding-top: 8px;
		color: var(--primary);
		font-family: var(--family-monospace);

		.drag-handle {
			--v-icon-color: var(--primary);

			margin-right: 8px;
		}

		.name {
			flex-grow: 1;
			margin-bottom: 0;
		}
	}
}

.widget-grid {
	position: relative;
	// display: grid;
	// grid-gap: 8px;
	// grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);

	& + & {
		margin-top: 8px;
	}
}

.full,
.fill {
	grid-column: 1 / span 6;
}

.v-input.hidden {
	--background-page: var(--background-subdued);
}

.v-input.monospace {
	--v-input-font-family: var(--family-monospace);
}

.v-select.monospace {
	--v-select-font-family: var(--family-monospace);
}

.v-icon {
	--v-icon-color: var(--foreground-subdued);
	--v-icon-color-hover: var(--foreground);

	&.hidden-icon {
		--v-icon-color-hover: var(--foreground-subdued);
	}

	&.unmanaged {
		--v-icon-color: var(--warning);
		--v-icon-color-hover: var(--warning);
	}
}

.drag-handle {
	cursor: grab !important;
}

.menu {
	:deep(.input) {
		border: var(--border-width) solid var(--border-subdued) !important;
	}

	:deep(.input:hover) {
		background-color: var(--card-face-color) !important;
		border: var(--border-width) solid var(--border-normal-alt) !important;
	}

	.label {
		display: flex;
		flex-grow: 1;
		align-items: center;
		align-self: stretch;
		overflow: hidden;
		cursor: pointer;

		.label-inner {
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;

			.name {
				margin-right: 8px;
				margin-left: 8px;
				font-family: var(--family-monospace);
			}
		}
	}

	.type {
		color: var(--foreground-subdued);
		font-family: var(--family-monospace);
		transition: opacity var(--fast) var(--transition);
		opacity: 0;
	}
	&:hover .type {
		opacity: 1;
	}
}

.sortable-ghost {
	border-radius: var(--border-radius);
	outline: 2px dashed var(--primary);

	> * {
		opacity: 0;
	}
}
.widget-grid {
	width: 100%;
	display: grid;
	grid-template-columns: repeat(6, minmax(0, 1fr));
	gap: 10px;
	padding-left: 8px;
	padding-right: 8px;
	.grid-full {
		grid-column: span 6 / span 6;
	}
	.grid-half {
		grid-column: span 3 / span 6;
	}
	.grid-one {
		grid-column: span 1 / span 6;
	}
	.grid-two {
		grid-column: span 2 / span 6;
	}
	.grid-three {
		grid-column: span 3 / span 6;
	}
	.grid-four {
		grid-column: span 4 / span 6;
	}
	.grid-five {
		grid-column: span 5 / span 6;
	}
}
</style>
