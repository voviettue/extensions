<template>
	<private-view title="Query Detail">
		<template #headline>
			<v-breadcrumb :items="[{ name: 'Queries', to: '/front-office/queries' }]" />
		</template>

		<template #title-outer:prepend>
			<v-button class="header-icon" rounded disabled icon secondary>
				<v-icon name="star" />
			</v-button>
		</template>

		<template #navigation>
			<navigation></navigation>
		</template>

		<template #actions>
			<v-button
				v-tooltip.bottom="'Save'"
				icon
				rounded
				:disabled="!isAdmin || !hasEdits"
				:loading="actionProcessing === 'save'"
				@click="saveAndNavigate"
			>
				<v-icon name="check" />
			</v-button>
			<v-button
				v-if="modelValue.query !== 'json'"
				v-tooltip.bottom="'Execute'"
				rounded
				icon
				:disabled="!isAdmin"
				:loading="actionProcessing === 'execute'"
				@click="execute"
			>
				<v-icon name="play_arrow" />
			</v-button>
		</template>

		<template #sidebar>
			<sidebar-detail icon="info" :title="t('information')" close></sidebar-detail>
			<query-log-sidebar></query-log-sidebar>
		</template>

		<div class="padding-box query-detail-container">
			<v-form
				v-model="modelValue"
				primary-key="+"
				class="field-fault"
				:fields="formFields"
				:initial-values="initialValues"
				:validation-errors="validationErrors"
			></v-form>

			<div class="group-raw">
				<ExtensionOptionsComponent
					v-model="modelValue.options"
					collection="cms_queries"
					:options-fields="optionsFields"
					:validation-errors="validationErrors"
				/>
			</div>
		</div>

		<v-dialog v-model="confirmExecute" @esc="confirmExecute = false">
			<v-card>
				<v-card-title>Unsaved Changes</v-card-title>
				<v-card-text>Are you sure you want to update and execute this query?</v-card-text>
				<v-card-actions>
					<v-button secondary @click="confirmExecute = false">Cancel</v-button>
					<v-button @click="saveAndExecute">Update and Execute</v-button>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</private-view>
</template>

<script setup lang="ts">
import { useApi, useStores } from '@directus/extensions-sdk';
import { useRoute, useRouter } from 'vue-router';
import { onBeforeMount, ref, Ref, computed, watch } from 'vue';
import { useValidate } from '../../composables/use-validate';
import { formFields } from '../../constants/query';
import { useI18n } from 'vue-i18n';
import { ExtensionOptionsContext } from '../../types/extensions';
import { useFrontOfficeStore } from '../../stores/front-office';
import queryConfigList from '../../queries';
import snakeCase from 'lodash/snakeCase';
import Navigation from '../navigation.vue';
import ExtensionOptionsComponent from '../shared/extension-options.vue';
import QueryLogSidebar from './query-log-sidebar.vue';
import isEqual from 'lodash/isEqual';

const api = useApi();
const route = useRoute();
const router = useRouter();
const { useUserStore } = useStores();
const { isAdmin } = useUserStore();
const { validateItem } = useValidate();
const { t } = useI18n();
const frontOfficeStore = useFrontOfficeStore();
const confirmExecute = ref(false);

const modelValue: Ref<Record<string, any>> = ref({ options: {} });
const validationErrors: Ref<Record<string, any>[]> = ref([]);
const initialValues: Ref<Record<string, any>> = ref({
	name: '',
	timeout: 10000,
	query: null,
	options: null,
	refresh_on_load: false,
});
const actionProcessing = ref('');

watch(
	() => modelValue.value.name,
	(val) => {
		modelValue.value.key = snakeCase(val);
	}
);

const hasEdits = computed(() => {
	let isUpdated = false;
	const excludeField = ['output'];

	for (const [key, value] of Object.entries(initialValues.value)) {
		if (!isEqual(value, modelValue.value[key]) && !excludeField.includes(key)) return (isUpdated = true);
	}
	return isUpdated;
});

const optionsFields = computed(() => {
	const query = queryConfigList.find((e) => modelValue.value.query === e.id);
	const options = query?.options || [];
	if (typeof options === 'function') {
		const ctx = { values: modelValue.value } as ExtensionOptionsContext;
		return options(ctx);
	}

	return options;
});

async function execute() {
	try {
		if (hasEdits.value) {
			confirmExecute.value = true;
			return;
		}

		actionProcessing.value = 'execute';
		const responseExecute = await api.patch(`/front-office/queries/${route.params.id}/execute`);
		modelValue.value.output = responseExecute?.data;

		await api.patch(`/items/cms_queries/${route.params.id}`, { output: modelValue.value.output });
	} catch {
		//
	} finally {
		actionProcessing.value = '';
	}

	await getLogs();
}

async function getDetailPage() {
	try {
		actionProcessing.value = 'getDetailPage';
		const resQueryDetails = await api.get(`/items/cms_queries/${route.params.id}`);
		initialValues.value = { ...resQueryDetails?.data?.data } || {};
		initialValues.value.output = initialValues.value?.output && JSON.parse(initialValues.value.output);
		modelValue.value = Object.assign({}, initialValues.value);
	} catch {
		//
	} finally {
		actionProcessing.value = '';
	}
}

async function save() {
	validationErrors.value = [];
	const dataForm = { ...modelValue.value, ...modelValue.value.options };
	validationErrors.value = validateItem(dataForm, [...formFields, ...optionsFields.value]);
	if (validationErrors.value.length) return;

	actionProcessing.value = 'save';

	if (modelValue.value?.query === 'json') {
		modelValue.value.output = modelValue.value?.options;
	}

	try {
		await api.patch(`/items/cms_queries/${route.params.id}`, modelValue.value);
		initialValues.value = { ...modelValue.value };
	} catch {
		//
	} finally {
		actionProcessing.value = '';
	}
}

async function getLogs() {
	if (!route.params.id) return;

	const query = {
		params: { filter: { _and: [{ action: { _eq: 'execute ' } }, { item: { _eq: route.params.id } }] } },
	};

	await frontOfficeStore.getLogListByQuery(query);
}

async function saveAndExecute() {
	await save();
	await execute();
	confirmExecute.value = false;
}

async function saveAndNavigate() {
	try {
		await save();
		router.push('/front-office/queries');
	} catch {
		//
	}
}

onBeforeMount(async () => {
	await getDetailPage();
});
</script>

<style scoped>
.field-fault {
	padding-bottom: 1.25rem;
}
</style>
