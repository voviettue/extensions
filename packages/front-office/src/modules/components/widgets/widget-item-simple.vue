<template>
	<div class="widget-select">
		<v-input v-tooltip="`${widget.name}`" class="widget" readonly>
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
import { computed } from 'vue';
import WidgetOptions from './widget-options.vue';
import formFields from '../../widgets';

interface Props {
	widget: Record<string, any>;
	updateVisiable: (widget: any) => void;
	deleteWidget: (widget: any) => void;
}

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
	// margin: 0px 4px;
}

// .widget-select:deep(.widget-grid.group.full.nested) {
// 	// margin: 4px 0;

// 	.widget-select {
// 		margin: 0px 4px;
// 	}
// }
.widget {
	height: 42px;

	:deep(.input) {
		border: 1px solid var(--border-normal) !important;
		padding: 8px;
	}

	:deep(.input:hover) {
		background-color: var(--card-face-color) !important;
		border: 1px solid var(--border-normal-alt) !important;
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

.menu-select {
	margin: 4px;
}

// .menu-select:deep(.widget-grid) {
// 	grid-gap: 0;
// }

// .menu-select:deep(.widget-grid.group.full.nested) {
// 	margin: 4px 0;

// 	.menu-select {
// 		margin: 4px;
// 	}
// }

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
</style>
