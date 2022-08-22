<template>
	<v-drawer :title="`Editing Item in ${formatTitle(collection)}`" :model-value="isOpen" persistent @cancel="close">
		<div class="edit-menu-container">
			<div class="list-menu-config">
				<button
					v-for="menuConfig of listMenuConfig"
					:key="menuConfig.id"
					class="menu-config-item"
					:class="menuSelected?.id === menuConfig.id ? 'active' : 'gray'"
					@click="toggleMenuConfig(menuConfig)"
				>
					<div class="preview">
						<span class="fallback"><v-icon large :name="menuConfig.icon" /></span>
					</div>
					<v-text-overflow :text="menuConfig.name" class="name" />
				</button>

				<transition-expand>
					<div v-if="menuSelected" class="group">
						<v-form
							v-model="modelValue"
							class="field-fault"
							:fields="formFields"
							:initial-values="initialValues"
							:validation-errors="validationErrors"
						/>

						<v-divider inline />

						<div class="group-raw">
							<extension-options
								v-model="modelValue.options"
								:collection="collection"
								:options-fields="optionsFields"
								:validation-errors="validationErrors"
							/>
						</div>
					</div>
				</transition-expand>
			</div>
		</div>
		<template #actions>
			<v-button v-tooltip.bottom="`Save`" rounded icon :loading="isLoading" @click="saveSettingMenu">
				<v-icon name="check" />
			</v-button>
		</template>
	</v-drawer>
</template>
<script lang="ts">
import { ref, Ref, computed } from 'vue';
import { useApi } from '@directus/extensions-sdk';
import formatTitle from '@directus/format-title';
import { useValidate } from '../../composables/use-validate';
import listMenuConfig from '../../menus';
import { ExtensionOptionsContext, MenuConfig } from '../../types/extensions';
import { formFields } from '../../constants/menu';
import ExtensionOptions from '../shared/extension-options.vue';

export default {
	components: { ExtensionOptions },
	props: {
		menu: {
			type: Object,
			default: null,
		},
		isOpen: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['close'],
	setup(props, { emit }) {
		const collection = 'cms_menus';
		const api = useApi();
		const { validateItem } = useValidate();

		const isLoading = ref<boolean>(false);
		const validationErrors: Ref<Record<string, any>[]> = ref([]);
		const modelValue: Ref<Record<string, any>> = ref({ ...props.menu });
		const menuSelected: Ref<MenuConfig | null> = ref(
			listMenuConfig.find((menu: MenuConfig) => menu.id == props.menu.menu) as MenuConfig
		);

		const initialValues = ref({
			name: null,
			label: null,
			icon: null,
			hidden: false,
			parent: null,
		});

		const optionsFields = computed(() => {
			const options = menuSelected.value?.options ?? [];
			if (typeof options === 'function') {
				const ctx = { values: modelValue.value } as ExtensionOptionsContext;
				return options(ctx);
			}

			return options;
		});

		return {
			listMenuConfig,
			close,
			isLoading,
			saveSettingMenu,
			collection,
			formatTitle,
			formFields,
			optionsFields,
			modelValue,
			validationErrors,
			menuSelected,
			toggleMenuConfig,
			initialValues,
		};

		function toggleMenuConfig(menu: MenuConfig) {
			menuSelected.value = menu.id !== menuSelected.value?.id ? menu : null;
			modelValue.value.menu = menuSelected.value?.id || '';
		}

		async function saveSettingMenu() {
			const dataForm = { ...modelValue.value, ...modelValue.value.options };

			validationErrors.value = [];
			validationErrors.value = validateItem(dataForm, [...formFields, ...optionsFields.value]);
			if (validationErrors.value.length) return;

			isLoading.value = true;
			try {
				await api.patch(`/items/${collection}/${props.menu?.id}`, modelValue.value);

				close();
			} catch {
				//
			}
			isLoading.value = false;
		}

		function close() {
			emit('close');
		}
	},
};
</script>
<style scoped>
.edit-menu-container {
	padding: 20px;
}

.type-grid {
	--columns: 1;

	display: grid;
	grid-template-columns: repeat(var(--columns), 1fr);
	gap: 32px;

	@media (min-width: 400px) {
		--columns: 2;
	}

	@media (min-width: 600px) {
		--columns: 3;
	}

	@media (min-width: 840px) {
		--columns: 4;
	}
}

.menu-config-item {
	min-height: 100px;
	overflow: hidden;
	text-align: center;
	margin-right: 2rem;
}

.preview {
	--v-icon-color: var(--background-page);

	display: flex;
	align-items: center;
	justify-content: center;
	width: 160px;
	height: 100px;
	margin-bottom: 8px;
	border: var(--border-width) solid var(--border-subdued);
	border-radius: var(--border-radius);
	transition: var(--fast) var(--transition);
	transition-property: background-color, border-color;
}

.preview img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.preview .svg {
	display: contents;
}

.preview :deep(svg) {
	width: 100%;
	height: 100%;
}

.preview :deep(svg) .glow {
	filter: drop-shadow(0 0 4px var(--primary-50));
}

.preview .fallback {
	--v-icon-color: var(--primary-75);

	display: block;
	padding: 8px 16px;
	background-color: var(--background-page);
	border: 2px solid var(--primary);
	border-radius: var(--border-radius);
	box-shadow: 0 0 8px var(--primary-75);
}

.menu-config-item:hover .preview {
	border-color: var(--border-normal);
}

.menu-config-item.active .preview {
	background-color: var(--primary-alt);
	border-color: var(--primary);
}

.menu-config-item.gray .preview {
	--primary: var(--foreground-subdued);
	--primary-50: var(--foreground-subdued);

	background-color: var(--background-subdued);
}

.menu-config-item.gray .preview .fallback {
	--v-icon-color: var(--foreground-subdued);

	box-shadow: 0 0 8px var(--foreground-subdued);
}

.group {
	background-color: var(--background-subdued);
	border-top: 3px solid var(--border-normal);
	padding: 2.125rem;
	margin-top: 2rem;
}

.field-fault {
	padding: 0;
}

.field-options {
	padding-bottom: 2rem;
}

.v-divider {
	margin: 3rem 0 2rem 0;
}
</style>
