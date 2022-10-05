<template>
	<div class="table-column-select full">
		<v-input class="column" readonly>
			<template #prepend>
				<v-icon class="drag-handle" name="drag_handle" @click.stop />
			</template>

			<template #input>
				<div v-tooltip="`${column.options?.display ?? 'None'}`" class="label" @click="isOpenDetail = true">
					<div class="label-inner">
						<v-icon v-if="!!column.icon" :name="column.icon" @click.stop />
						<span class="name">{{ column.label }}</span>
						<small class="type">{{ column.key }}</small>
					</div>
				</div>
			</template>

			<template #append>
				<div class="icons">
					<v-icon v-if="hidden" v-tooltip="`Hidden menu`" name="visibility_off" class="hidden-icon" small />
					<table-column-select-menu
						:column="column"
						@open-detail="isOpenDetail = true"
						@toggle-visibility="$emit('toggleVisibility', column)"
						@delete="$emit('delete', column)"
					/>
				</div>
			</template>
		</v-input>

		<table-column-detail
			:is-open="isOpenDetail"
			:column="column"
			@close="close"
			@update="
				$emit('update', $event);
				close();
			"
		/>
	</div>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import TableColumnSelectMenu from './table-column-select-menu.vue';
import TableColumnDetail from './table-column-detail.vue';

export default {
	components: { TableColumnSelectMenu, TableColumnDetail },
	props: {
		column: {
			type: Object,
			default: null,
		},
	},
	emits: ['update', 'toggleVisibility', 'delete'],
	setup(props, { emit }) {
		const isOpenDetail = ref<boolean>(false);
		const hidden = computed(() => props.column?.hidden === true);

		return {
			hidden,
			isOpenDetail,
			close,
		};

		function close() {
			isOpenDetail.value = false;
		}
	},
};
</script>
<style lang="scss" scoped>
.table-column-select {
	--input-height: 52px;
	--input-padding: 8px;
	margin: 4px;
}

.full,
.fill {
	grid-column: 1 / span 2;
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

.column {
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
				font-family: var(--family-monospace);
			}

			.interface {
				display: none;
				color: var(--foreground-subdued);
				font-family: var(--family-monospace);
				opacity: 0;
				transition: opacity var(--fast) var(--transition);

				@media (min-width: 600px) {
					display: initial;
				}
			}
		}
	}

	&:hover {
		.label {
			.interface {
				opacity: 1;
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

.drag-handle {
	cursor: grab !important;
}

.icons {
	.v-icon + .v-icon:not(:last-child) {
		margin-left: 8px;
	}
}

.required {
	position: relative;
	left: -8px;
	color: var(--primary);
}

.sortable-ghost {
	border-radius: var(--border-radius);
	outline: 2px dashed var(--primary);

	> * {
		opacity: 0;
	}
}
</style>
