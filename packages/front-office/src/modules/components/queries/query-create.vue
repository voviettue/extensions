<template>
	<v-drawer
		title="Create New Query"
		:model-value="isOpen"
		class="new-query"
		persistent
		@cancel="$router.push('/front-office/queries')"
	>
		<div class="new-query-container">
			<div class="list-query">
				<button
					v-for="queryConfig of queryConfigList"
					:key="queryConfig.id"
					class="query-item"
					:class="{
						active: querySelected?.id === queryConfig.id,
						gray: querySelected?.id && querySelected?.id !== queryConfig.id,
					}"
					@click="onChangeQuery(queryConfig)"
				>
					<div class="preview">
						<span class="fallback">
							<v-icon large :name="queryConfig.icon" />
						</span>
					</div>
					<v-text-overflow :text="queryConfig.name" class="name" />
				</button>
			</div>

			<transition-expand>
				<div v-if="querySelected" class="group">
					<v-form
						v-model="modelValue"
						primary-key="+"
						class="field-fault"
						:fields="defaultFields"
						:initial-values="initialValues"
						:validation-errors="validationErrors"
					></v-form>

					<v-divider inline />

					<div class="group-raw">
						<ExtensionOptionsComponent
							v-model="modelValue.options"
							collection="cms_queries"
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
				:loading="saving"
				:disabled="isDisable"
				@click="handleCreateQuery"
			>
				<v-icon name="check" />
			</v-button>
		</template>
	</v-drawer>
</template>
<script setup lang="ts">
import { ref, Ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { formFields } from '../../constants/query';
import { useItem } from '../../composables/use-item';
import { ExtensionOptionsContext, QueryConfig } from '../../types/extensions';
import queryConfigList from '../../queries';
import isEmpty from 'lodash/isEmpty';
import snakeCase from 'lodash/snakeCase';
import ExtensionOptionsComponent from '../shared/extension-options.vue';

const { edits, saving, save, validationErrors, fieldsWithPermissions } = useItem('cms_queries', '+');
const router = useRouter();

const modelValue: Ref<Record<string, any>> = ref({ options: {} });
const querySelected: Ref<QueryConfig | null> = ref(null);
const isOpen = ref(true);
const initialValues = ref({
	name: '',
	timeout: 10000,
	query: null,
	options: null,
	refresh_on_load: true,
});

watch(
	() => modelValue.value.name,
	(val) => {
		modelValue.value.key = snakeCase(val);
	}
);

const isDisable = computed(() => isEmpty(modelValue.value.query));
const optionsFields = computed(() => {
	const options = querySelected.value?.options ?? [];
	if (typeof options === 'function') {
		const ctx = { values: modelValue.value } as ExtensionOptionsContext;
		return options(ctx);
	}

	return options;
});
const defaultFields = computed(() => {
	if (typeof formFields === 'function') {
		const ctx = { values: modelValue.value } as ExtensionOptionsContext;
		return formFields(ctx);
	}
	return formFields;
});

function onChangeQuery(query: QueryConfig) {
	querySelected.value = query.id !== querySelected.value?.id ? query : null;
	modelValue.value.query = querySelected.value?.id || '';
}

async function handleCreateQuery() {
	try {
		edits.value = { ...initialValues.value, ...modelValue.value.options, ...modelValue.value };
		fieldsWithPermissions.value = [...defaultFields.value, ...optionsFields.value];

		if (querySelected.value?.beforeSave) {
			edits.value = querySelected.value.beforeSave(edits.value);
		}

		await save();

		router.push('/front-office/queries');
	} catch {
		//
	}
}
</script>
<style scoped>
.new-query-container {
	margin: 1.25rem 2rem;
}
.content {
	padding: var(--content-padding);
	padding-top: 0;
	padding-bottom: var(--content-padding-bottom);
}

.query-item {
	min-height: 100px;
	overflow: hidden;
	text-align: left;
	margin-right: 2rem;
	margin-bottom: 2rem;
}

.preview {
	--v-icon-color: var(--background-page);

	display: flex;
	align-items: center;
	justify-content: center;
	width: 128px;
	height: 100px;
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

.query-item:hover .preview {
	border-color: var(--border-normal);
}

.query-item.active .preview {
	background-color: var(--primary-alt);
	border-color: var(--primary);
}

.query-item.gray .preview {
	--primary: var(--foreground-subdued);
	--primary-50: var(--foreground-subdued);

	background-color: var(--background-subdued);
}

.query-item.gray .preview .fallback {
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
