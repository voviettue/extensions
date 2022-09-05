<template>
	<div class="menu-select full">
		<draggable
			v-if="menu.menu == 'category'"
			class="menu-grid group full nested"
			:model-value="nestedMenus"
			:force-fallback="true"
			handle=".drag-handle"
			:group="{ name: 'setting-menus' }"
			:animation="150"
			:fallback-on-body="true"
			:invert-swap="true"
			@update:model-value="onGroupSortChange"
		>
			<template #header>
				<div class="header full">
					<v-icon class="drag-handle" name="drag_indicator" @click.stop />
					<span class="name">{{ menu.label }}</span>
					<v-icon v-if="hidden" v-tooltip="`Hidden menu`" name="visibility_off" class="hidden-icon" small />
					<menu-item-select-menu
						:item="menu"
						:no-delete="nestedMenus.length > 0"
						:no-duplicate="nestedMenus.length > 0"
						@toggle-visibility="toggleVisibility"
						@duplicate="duplicateMenuItem"
						@delete="deleteActive = true"
					/>
				</div>
			</template>

			<template #item="{ element }">
				<menu-item
					:menu="element"
					:menu-list="menuList"
					@refresh="$emit('refresh')"
					@set-nested-sort="$emit('setNestedSort', $event)"
				/>
			</template>
		</draggable>

		<v-input v-else class="menu" readonly>
			<template #prepend>
				<v-icon class="drag-handle" name="drag_indicator" @click.stop />
			</template>

			<template #input>
				<div
					v-tooltip="`${menu.key}`"
					class="label"
					@click="$router.push(`/front-office/settings/project/${menu.project}/menu/${menu.id}`)"
				>
					<div class="label-inner">
						<v-icon v-if="!!menu.icon" class="drag-handle" :name="menu.icon" @click.stop />
						<span class="name">{{ menu.label }}</span>
						<small class="type">{{ config?.key }}</small>
					</div>
				</div>
			</template>

			<template #append>
				<div class="icons">
					<v-icon v-if="hidden" v-tooltip="`Hidden menu`" name="visibility_off" class="hidden-icon" small />
					<menu-item-select-menu
						:item="menu"
						@toggle-visibility="toggleVisibility"
						@duplicate="duplicateMenuItem"
						@delete="deleteActive = true"
					/>
				</div>
			</template>
		</v-input>

		<v-dialog v-model="deleteActive" @esc="deleteActive = false">
			<v-card>
				<v-card-title>
					{{ `Are you sure you want to delete this menu "${menu.key}"? This action can not be undone.` }}
				</v-card-title>
				<v-card-actions>
					<v-button secondary @click="deleteActive = false">Cancel</v-button>
					<v-button :loading="deleting" kind="danger" @click="deleteMenuItem">Delete</v-button>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import { useApi } from '@directus/extensions-sdk';
import MenuItemSelectMenu from './menu-item-select-menu.vue';
import formatTitle from '@directus/format-title';
import listMenuConfig from '../../menus';
import Draggable from 'vuedraggable';

export default {
	components: { Draggable, MenuItemSelectMenu },
	props: {
		menu: {
			type: Object,
			default: null,
		},
		menuList: {
			type: Array,
			default: () => [],
		},
	},
	emits: ['refresh', 'setNestedSort'],
	setup(props, { emit }) {
		const collection = 'cms_menus';
		const api = useApi();

		const { deleteActive, deleting, deleteMenuItem } = useDeleteMenuItem();

		const hidden = computed(() => props.menu?.hidden === true);

		const nestedMenus = computed(() => {
			return props.menuList
				?.filter((item) => props.menu?.id == item.parent)
				.sort((a: any, b: any) => (a.sort ?? 1000) - (b.sort ?? 1000));
		});

		const config = computed(() => listMenuConfig.find((e) => e.id === props.menu.menu));

		return {
			nestedMenus,
			config,
			onGroupSortChange,
			hidden,
			formatTitle,
			toggleVisibility,
			deleteActive,
			deleting,
			deleteMenuItem,
			duplicateMenuItem,
			close,
		};

		async function onGroupSortChange(items: Array<Record<string, any>>) {
			let updateValues: Array<Record<string, any>> = [];
			if (items.length == 0) {
				updateValues = nestedMenus.value.map((item: any) => {
					return { ...item, parent: null };
				});
			} else {
				updateValues = items.map((item: any, index: number) => {
					return {
						...item,
						parent: props.menu.id,
						sort: index,
					};
				});
			}

			emit('setNestedSort', updateValues);
		}

		async function toggleVisibility() {
			const data = { hidden: !props.menu?.hidden };

			try {
				await api.patch(`/items/${collection}/${props.menu?.id}`, data);

				close();
			} catch {
				//
			}
		}

		async function duplicateMenuItem() {
			const data = { ...props.menu };
			delete data.id;

			try {
				await api.post(`/items/${collection}`, data);

				close();
			} catch {
				//
			}
		}

		function useDeleteMenuItem() {
			const deleteActive = ref(false);
			const deleting = ref(false);

			return {
				deleteActive,
				deleting,
				deleteMenuItem,
			};

			async function deleteMenuItem() {
				try {
					await api.delete(`/items/${collection}/${props.menu?.id}`);

					close();
				} catch {
					//
				}

				deleting.value = false;
				deleteActive.value = false;
			}
		}

		function close() {
			emit('refresh');
		}
	},
};
</script>
<style lang="scss" scoped>
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

.menu-grid {
	position: relative;
	display: grid;
	grid-gap: 8px;
	grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);

	& + & {
		margin-top: 8px;
	}
}

.menu-select {
	margin: 4px;
}

.menu-select:deep(.menu-grid) {
	grid-gap: 0;
}

.menu-select:deep(.menu-grid.group.full.nested) {
	margin: 4px 0;

	.menu-select {
		margin: 4px;
	}
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
