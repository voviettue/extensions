<template>
	<div class="widget-select">
		<!-- if widget is container  -->
		<draggable
			v-if="config?.group"
			class="widget-grid group full nested"
			:model-value="nestedWidgets"
			:force-fallback="true"
			handle=".drag-handle"
			:group="{ name: 'widgets' }"
			:animation="150"
			:fallback-on-body="true"
			:invert-swap="true"
			@update:model-value="updateParent"
		>
			<template #header>
				<div class="header full">
					<v-icon class="drag-handle" name="drag_indicator" @click.stop />
					<span class="name">{{ widget.name }}</span>
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
				<widget-item
					v-tooltip="`${element.name}`"
					:widget="element"
					:list-widget="listWidget"
					:update-visiable="updateVisiable"
					:delete-widget="deleteWidget"
					:class="getClass(element)"
				/>
			</template>
		</draggable>
		<v-input v-else v-tooltip="`${widget.name}`" class="widget" readonly>
			<template #prepend>
				<v-icon class="drag-handle" name="drag_indicator" @click.stop />
			</template>

			<template #input>
				<div class="label" @click="$router.push({ path: `/front-office/pages/${widget.page}/widget/${widget.id}` })">
					<div class="label-inner">
						<v-icon v-if="!!config?.icon" class="drag-handle" :name="config.icon" @click.stop />
						<span class="name">{{ widget.name }}</span>
						<small class="type">{{ config?.name }}</small>
					</div>
				</div>
			</template>

			<template #append>
				<div class="icons">
					<v-icon v-if="widget.hidden" v-tooltip="`Hidden menu`" name="visibility_off" class="hidden-icon" small />
					<widget-options :widget="widget" :update-visiable="updateVisiable" :delete-widget="deleteWidget" />
				</div>
			</template>
		</v-input>
	</div>
</template>
<script setup lang="ts">
import { computed, defineEmits } from 'vue';
import WidgetOptions from './widget-options.vue';
import formFields from '../../widgets';
import Draggable from 'vuedraggable';
import { useApi } from '@directus/extensions-sdk';

interface Props {
	widget: Record<string, any>;
	listWidget: Record<string, any>[];
	updateVisiable: () => void;
	deleteWidget: () => void;
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
const nestedWidgets = computed(() => {
	return props.listWidget
		?.filter((item) => props.widget?.id === item.parent)
		.sort((a: any, b: any) => (a.sort ?? 1000) - (b.sort ?? 1000));
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
function getClass(el: Record<string, any>) {
	switch (el.width) {
		case 'full':
			return 'grid-full';
		case 'half':
			return 'grid-half';
		case '1':
			return 'grid-one';
		case '2':
			return 'grid-two';
		case '3':
			return 'grid-three';
		case '4':
			return 'grid-four';
		case '5':
			return 'grid-five';
	}
}
</script>

<style scoped lang="scss">
.drag-handle {
	cursor: grab !important;
}
/* .page-item {
	margin-bottom: 10px;
}
.page-icon {
	margin-right: 10px;
}
.page-endpoint.hidden {
	color: #ccc;
	opacity: 0.5;
} */

.widget-select {
	margin: 4px;
}

.widget-select:deep(.widget-grid) {
	grid-gap: 0;
}

.widget-select:deep(.widget-grid.group.full.nested) {
	margin: 4px 0;

	.widget-select {
		margin: 4px;
	}
}
.widget {
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
	padding-bottom: 16px;
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

.menu-select {
	margin: 4px;
}

.menu-select:deep(.widget-grid) {
	grid-gap: 0;
}

.menu-select:deep(.widget-grid.group.full.nested) {
	margin: 4px 0;

	.menu-select {
		margin: 4px;
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
	gap: 12px;
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
