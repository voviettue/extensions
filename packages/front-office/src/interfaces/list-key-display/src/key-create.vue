<template>
	<v-drawer :title="`Creating Key`" :model-value="isOpen" persistent @cancel="$emit('close')">
		<template #sidebar>
			<v-tabs v-model="currentTab" vertical>
				<v-tab v-for="tab in tabs" :key="tab.value" :value="tab.value">
					{{ tab.text }}
				</v-tab>
			</v-tabs>
		</template>

		<template #actions>
			<v-button v-tooltip.bottom="`Save`" rounded icon :loading="isLoading" @click="save">
				<v-icon name="check" />
			</v-button>
		</template>

		<div class="create-condition-container">
			<v-form
				v-if="currentTab == 'properties'"
				v-model="modelValue"
				class="field-fault"
				:fields="formFields"
				:validation-errors="validationErrors"
			/>
			<div v-if="currentTab == 'displayValue'" class="list-display-config">
				<button
					v-for="displayConfig of listDisplayConfig"
					:key="displayConfig.id"
					class="display-config-item"
					:class="selectedDisplay?.id === displayConfig.id ? 'active' : 'gray'"
					@click="toggleDisplayConfig(displayConfig)"
				>
					<div class="preview">
						<span class="fallback"><v-icon large :name="displayConfig.icon" /></span>
					</div>
					<v-text-overflow :text="displayConfig.name" class="name" />
				</button>

				<transition-expand>
					<div v-if="selectedDisplay" class="group">
						<div class="group-raw">
							<extension-options
								v-model="modelValue.displayOptions"
								:options-fields="optionsFields"
								:validation-errors="validationErrors"
								style="padding: 0"
							/>
						</div>
					</div>
				</transition-expand>
			</div>
		</div>
	</v-drawer>
</template>
<script lang="ts">
import { ref, Ref, computed, watch } from 'vue';
import formatTitle from '@directus/format-title';
import { useValidate } from '../../../modules/composables/use-validate';
import listDisplayConfig from '../../../modules/displays';
import { ExtensionOptionsContext, DisplayConfig } from '../../../modules/types/extensions';
import ExtensionOptions from '../../../modules/components/shared/extension-options.vue';
import snakeCase from 'lodash/snakeCase';
import cloneDeep from 'lodash/cloneDeep';

export default {
	components: { ExtensionOptions },
	props: {
		isOpen: {
			type: Boolean,
			default: false,
		},
		formFields: {
			type: Array,
			default: () => [],
		},
	},
	emits: ['close', 'create'],
	setup(props, { emit }) {
		const { validateItem } = useValidate();

		const isLoading = ref<boolean>(false);
		const validationErrors: Ref<Record<string, any>[]> = ref([]);
		const modelValue: Ref<Record<string, any>> = ref({ hidden: false, displayOptions: {} });
		const selectedDisplay: Ref<DisplayConfig | null> = ref(null);

		const initialValues = ref({
			key: null,
			label: null,
			hidden: false,
			tooltip: null,
		});

		watch(
			() => modelValue.value.label,
			(val: any) => {
				modelValue.value.key = snakeCase(val);
			}
		);

		const optionsFields = computed(() => {
			const options = selectedDisplay.value?.displayOptions ?? [];
			const values = cloneDeep(modelValue.value);
			values.options = values.displayOptions;
			if (typeof options === 'function') {
				const ctx = { values } as ExtensionOptionsContext;
				return options(ctx);
			}

			return options;
		});

		const tabs = computed(() => {
			return [
				{ value: 'properties', text: 'Properties' },
				{ value: 'displayValue', text: 'Display Value' },
			];
		});

		const currentTab = ref<string>('properties');

		return {
			currentTab,
			tabs,
			listDisplayConfig,
			close,
			isLoading,
			save,
			formatTitle,
			optionsFields,
			modelValue,
			validationErrors,
			selectedDisplay,
			toggleDisplayConfig,
			initialValues,
		};

		function toggleDisplayConfig(display: DisplayConfig) {
			selectedDisplay.value = display.id !== selectedDisplay.value?.id ? display : null;
			modelValue.value.display = selectedDisplay.value?.id || '';
			validationErrors.value = [];
		}

		async function save() {
			const dataForm = { ...modelValue.value, ...modelValue.value.displayOptions };

			validationErrors.value = [];
			validationErrors.value = validateItem(dataForm, [...props.formFields, ...optionsFields.value]);
			if (validationErrors.value.length) return;

			isLoading.value = true;

			emit('create', modelValue.value);
			modelValue.value = {};

			isLoading.value = false;
		}
	},
};
</script>
<style scoped>
.create-condition-container {
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

.display-config-item {
	min-height: 100px;
	overflow: hidden;
	text-align: center;
	margin: 0 0 2rem 2rem;
}

.preview {
	--v-icon-color: var(--background-page);

	display: flex;
	align-items: center;
	justify-content: center;
	width: 116px;
	height: 90px;
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

.display-config-item:hover .preview {
	border-color: var(--border-normal);
}

.display-config-item.active .preview {
	background-color: var(--primary-alt);
	border-color: var(--primary);
}

.display-config-item.gray .preview {
	--primary: var(--foreground-subdued);
	--primary-50: var(--foreground-subdued);

	background-color: var(--background-subdued);
}

.display-config-item.gray .preview .fallback {
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
