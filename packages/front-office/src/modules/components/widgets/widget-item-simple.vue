<template>
	<div>
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
					<widget-options :widget="widget" />
				</div>
			</template>
		</v-input>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import WidgetOptions from './widget-options.vue';
import formFields from '../../widgets';
import { Widget } from '../../types';

interface Props {
	widget: Widget;
}

const props = defineProps<Props>();
const config = computed(() => formFields.find((e) => e.id === props.widget.widget));
</script>

<style scoped lang="scss">
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
</style>
