<template>
	<div class="widget-select">
		<!-- if widget is container  -->
		<widget-item-group
			v-if="config?.group"
			:widget="widget"
			:list-widget="listWidget"
			:update-visiable="updateVisiable"
			:delete-widget="deleteWidget"
			:update-parent="updateParent"
			@reload="$emit('reload')"
		></widget-item-group>

		<!-- if widget is tabs  -->
		<widget-item-tabs
			v-else-if="config?.tabs"
			:widget="widget"
			:list-widget="listWidget"
			:update-visiable="updateVisiable"
			:delete-widget="deleteWidget"
			@reload="$emit('reload')"
		></widget-item-tabs>

		<widget-item-simple
			v-else
			:widget="widget"
			:update-visiable="updateVisiable"
			:delete-widget="deleteWidget"
		></widget-item-simple>
	</div>
</template>
<script setup lang="ts">
import { computed, defineEmits } from 'vue';
import formFields from '../../widgets';
import { useApi } from '@directus/extensions-sdk';
import WidgetItemSimple from './widget-item-simple.vue';
import WidgetItemGroup from './widget-item-group.vue';
import WidgetItemTabs from './widget-item-tabs.vue';

interface Props {
	widget: Record<string, any>;
	listWidget: Record<string, any>[];
	updateVisiable: (widget: any) => void;
	deleteWidget: (widget: any) => void;
}
const emit = defineEmits(['reload']);
const api = useApi();
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
});

const config = computed(() => formFields.find((e) => e.id === props.widget.widget));

async function updateParent(widgets) {
	try {
		const data = widgets.map((item, index) => {
			return {
				...item,
				sort: index,
				parent: props.widget.id,
			};
		});
		const apis = data.map((k: any) => {
			return api.patch(`/items/cms_widgets/${k.id}`, k);
		});
		await Promise.allSettled(apis);
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
	// margin: 0px 4px;
}

.widget-select:deep(.widget-grid) {
	grid-gap: 10px;
}

.widget-select:deep(.widget-grid.group.full.nested) {
	// margin: 4px 0;

	.widget-select {
		// margin: 0px 4px;
	}
}
.widget {
	height: 42px;

	:deep(.input) {
		border: 1px solid var(--border-normal) !important;
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
	padding: 10px;
	padding-top: 44px;
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
		width: 2px;
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
		margin-bottom: 10px;
		padding-top: 10px;
		color: var(--primary);
		font-family: var(--family-monospace);

		.drag-handle {
			--v-icon-color: var(--primary);

			margin-right: 8px;
		}

		.name {
			flex-grow: 1;
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
