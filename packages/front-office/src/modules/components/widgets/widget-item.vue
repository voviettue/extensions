<template>
	<div class="widget-select" :class="[`grid-col-${widget.width}`]">
		<!-- if widget is tabs  -->
		<widget-item-group v-if="widget.widget === 'tabs'" group="tabs" :widget="widget"></widget-item-group>

		<!-- if widget is container  -->
		<widget-item-group v-else-if="config?.group" :widget="widget"></widget-item-group>

		<!-- and other  -->
		<widget-item-simple v-else :widget="widget"></widget-item-simple>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Widget } from '../../types';
import formFields from '../../widgets';
import WidgetItemSimple from './widget-item-simple.vue';
import WidgetItemGroup from './widget-item-group.vue';

interface Props {
	widget: Widget;
}
const props = defineProps<Props>();
const config = computed(() => formFields.find((e) => e.id === props.widget.widget));
</script>

<style lang="scss">
.widget-select {
	&.sortable-ghost {
		border-radius: var(--border-radius);
		outline: 2px dashed var(--primary);

		> * {
			opacity: 0;
		}
	}

	.group {
		position: relative;
		min-height: var(--input-height);
		padding-top: 48px !important;
		border-radius: var(--border-radius);
		border: 1px solid var(--primary-25);

		> * {
			position: relative;
			z-index: 2;
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
			margin-bottom: 12px;
			padding-top: 12px;
			color: var(--primary);
			font-family: var(--family-monospace);

			&.full {
				grid-column: 1 / span 6;
			}

			.drag-handle {
				--v-icon-color: var(--primary);

				margin-right: 8px;
			}

			.name {
				flex-grow: 1;
			}

			.v-icon.has-click {
				--v-icon-color: var(--primary-75);
				--v-icon-color-hover: var(--primary);
			}
		}
	}
}
</style>
