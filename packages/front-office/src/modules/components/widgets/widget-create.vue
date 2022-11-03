<template>
	<v-drawer
		:title="primaryKey === '+' ? 'Create New Widgets' : 'Update Widget'"
		:model-value="isOpen"
		class="new-widget"
		persistent
		@cancel="$router.push(`/front-office/pages/${page}`)"
	>
		<div class="new-widget-container">
			<div class="list-widget">
				<button
					v-for="widgetConfig of widgetConfigList"
					:key="widgetConfig.id"
					class="widget-item"
					:class="{
						active: modelValue?.widget === widgetConfig.id,
						gray: modelValue?.widget !== widgetConfig.id,
					}"
					@click="onChangeWidgets(widgetConfig)"
				>
					<div class="preview">
						<span class="fallback">
							<v-icon large :name="widgetConfig.icon" />
						</span>
					</div>
					<v-text-overflow :text="widgetConfig.name" class="name" />
				</button>
			</div>

			<transition-expand>
				<div v-if="!!modelValue?.widget" class="group" style="grid-row: 2 / auto">
					<v-form
						v-model="modelValue"
						primary-key="+"
						class="field-fault"
						:fields="formFields"
						:initial-values="initialValues"
						:validation-errors="validationErrors"
					></v-form>

					<v-divider inline />

					<div class="group-raw">
						<ExtensionOptionsComponent
							v-model="modelValue.options"
							collection="cms_widgets"
							:options-fields="optionsFields"
							:validation-errors="validationErrors"
						/>
					</div>
				</div>
			</transition-expand>
		</div>
		<template #actions>
			<v-button
				v-tooltip.bottom="`Save`"
				rounded
				icon
				:loading="isLoading"
				:disabled="isDisable"
				@click="handleChangeWidgets"
			>
				<v-icon name="check" />
			</v-button>
		</template>
	</v-drawer>
</template>

<script setup lang="ts">
import { ref, Ref, computed, watch } from 'vue';
import { useApi } from '@directus/extensions-sdk';
import { useRouter, useRoute } from 'vue-router';
import { formFields } from '../../constants/widget';
import { useValidate } from '../../composables/use-validate';
import { ExtensionOptionsContext, WidgetConfig } from '../../types/extensions';
import widgetConfigList from '../../widgets';
import isEmpty from 'lodash/isEmpty';
import snakeCase from 'lodash/snakeCase';
import ExtensionOptionsComponent from '../shared/extension-options.vue';
import { useItem } from '../../composables/use-item';

const { validateItem } = useValidate();
const router = useRouter();
const route = useRoute();
const api = useApi();

const modelValue: Ref<Record<string, any>> = ref({ options: {} });
const isOpen = ref(true);
const isLoading = ref(false);
const initialValues = ref({
	name: null,
	width: 'full',
	widget: null,
	custom_css: null,
	options: null,
	hidden: false,
});
const page = route.params.id;
const primaryKey = route.params.widgetId as string;
const parentId = route.params.parentId as string;
const tabKey = route.query?.tab as string;

const { item, edits, getItem, save, validationErrors } = useItem('cms_widgets', primaryKey);

if (primaryKey === '+') {
	watch(
		() => modelValue.value.name,
		(val) => {
			modelValue.value.key = snakeCase(val);
		}
	);
} else {
	getItem().then(() => {
		modelValue.value = { ...item.value };
	});
}

const selectedWidget = computed(() => {
	return widgetConfigList.find((e) => e.id === modelValue.value?.widget);
});

const isDisable = computed(() => isEmpty(modelValue.value?.widget));
const optionsFields = computed(() => {
	const options = selectedWidget.value?.options ?? [];
	if (typeof options === 'function') {
		const ctx = { values: modelValue.value } as ExtensionOptionsContext;
		return options(ctx);
	}

	return options;
});

function onChangeWidgets(widget: WidgetConfig) {
	modelValue.value.widget = widget.id;
}

async function handleChangeWidgets() {
	validationErrors.value = [];
	const dataForm = { ...initialValues.value, ...modelValue.value, ...modelValue.value.options };
	const widgetOptionsFields = Array.isArray(optionsFields.value) ? optionsFields.value : [];
	validationErrors.value = validateItem(dataForm, [...formFields, ...widgetOptionsFields]);
	if (validationErrors.value.length) return;
	isLoading.value = true;
	try {
		edits.value = { ...dataForm, page };
		if (selectedWidget.value?.beforeSave) {
			edits.value = selectedWidget.value.beforeSave(edits.value);
		}
		if (parentId) {
			edits.value.parent = parentId;
		}

		await save();

		if (tabKey) {
			await updateTab(tabKey);
		}

		router.push(`/front-office/pages/${page}`);
	} catch {
		// do nothing
	} finally {
		isLoading.value = false;
	}
}

async function updateTab(tabKey) {
	const res = await api.get(`/items/cms_widgets/${item.value!.parent}`);
	const tab = res.data.data;
	const tabs = tab.options?.tabs.map((tab: any) => {
		if (tab.key === tabKey) {
			const widgets = tab.widgets ?? [];
			widgets.push(item.value!.id);
			tab.widgets = widgets;
		}
		return tab;
	});

	await api.patch(`/items/cms_widgets/${item.value!.parent}`, { options: { ...tab.options, tabs: tabs } });
}
</script>
<style scoped lang="scss">
.new-widget-container {
	margin: 1.25rem 2rem;

	:deep(.v-divider) {
		margin-top: 20px;
		margin-bottom: 0;
	}
}
.content {
	padding: var(--content-padding);
	padding-top: 0;
	padding-bottom: var(--content-padding-bottom);
}

.widget-item {
	min-height: 80px;
	overflow: hidden;
	text-align: center;
	margin-right: 1.5rem;
	margin-bottom: 1.5rem;
}

.preview {
	--v-icon-color: var(--background-page);

	display: flex;
	align-items: center;
	justify-content: center;
	width: 110px;
	height: 80px;
	margin-bottom: 8px;
	border: var(--border-width) solid var(--border-subdued);
	border-radius: var(--border-radius);
	transition: var(--fast) var(--transition);
	transition-property: background-color, border-color;
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

.widget-item:hover .preview {
	border-color: var(--border-normal);
}

.widget-item.active .preview {
	background-color: var(--primary-alt);
	border-color: var(--primary);
}

.widget-item.gray .preview {
	--primary: var(--foreground-subdued);
	--primary-50: var(--foreground-subdued);

	background-color: var(--background-subdued);
}

.widget-item.gray .preview .fallback {
	--v-icon-color: var(--foreground-subdued);

	box-shadow: 0 0 8px var(--foreground-subdued);
}
.group {
	--form-vertical-gap: 2rem;
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
