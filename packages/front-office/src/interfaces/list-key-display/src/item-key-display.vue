<template>
	<div class="table-display-select full">
		<v-input class="display" readonly>
			<template #prepend>
				<v-icon class="drag-handle" name="drag_handle" @click.stop />
			</template>

			<template #input>
				<div v-tooltip="`${item.options?.display ?? 'None'}`" class="label" @click="isOpenDetail = true">
					<div class="label-inner">
						<v-icon v-if="!!item.icon" :name="item.icon" @click.stop />
						<span class="name">{{ item.label }}</span>
						<small class="type">{{ item.key }}</small>
					</div>
				</div>
			</template>

			<template #append>
				<div class="icons">
					<v-icon v-if="hidden" v-tooltip="`Hidden menu`" name="visibility_off" class="hidden-icon" small />
					<key-select-menu
						:item="item"
						@open-detail="isOpenDetail = true"
						@toggle-visibility="$emit('toggleVisibility', item)"
						@delete="$emit('delete', item)"
					/>
				</div>
			</template>
		</v-input>

		<key-update
			:is-open="isOpenDetail"
			:form-fields="formFields"
			:item="item"
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
import KeySelectMenu from './key-select-menu.vue';
import KeyUpdate from './key-update.vue';

export default {
	components: { KeySelectMenu, KeyUpdate },
	props: {
		item: {
			type: Object,
			default: null,
		},
		formFields: {
			type: Array,
			default: () => [],
		},
	},
	emits: ['update', 'toggleVisibility', 'delete'],
	setup(props, { emit }) {
		const isOpenDetail = ref<boolean>(false);
		const hidden = computed(() => props.item?.hidden === true);

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
.table-display-select {
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

.display {
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
