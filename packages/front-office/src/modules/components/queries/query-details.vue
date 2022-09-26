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
				:loading="saving"
				@click="updateAndNavigate"
			>
				<v-icon name="check" />
			</v-button>
			<v-button
				v-if="displayExecute"
				v-tooltip.bottom="'Execute'"
				rounded
				icon
				:disabled="!isAdmin"
				:loading="executing"
				@click="execute"
			>
				<v-icon name="play_arrow" />
			</v-button>
		</template>

		<template #sidebar>
			<sidebar-detail icon="info" title="Information" close></sidebar-detail>
			<query-log-sidebar></query-log-sidebar>
		</template>

		<div class="padding-box query-detail-container">
			<v-form
				v-model="modelValue"
				primary-key="+"
				class="field-fault"
				:fields="defaultFields"
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
					<v-button @click="updateAndExecute">Update and Execute</v-button>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</private-view>
</template>

<script setup lang="ts">
import { useApi, useStores } from '@directus/extensions-sdk';
import { useRoute, useRouter } from 'vue-router';
import { ref, Ref, computed } from 'vue';
import { useItem } from '../../composables/use-item';
import { useNotification } from '../../composables/use-notification';
import { formFields } from '../../constants/query';
import { ExtensionOptionsContext } from '../../types/extensions';
import { useFrontOfficeStore } from '../../stores/front-office';
import queryConfigList from '../../queries';
import Navigation from '../navigation.vue';
import ExtensionOptionsComponent from '../shared/extension-options.vue';
import QueryLogSidebar from './query-log-sidebar.vue';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import isJson from '../../../endpoint/utils/is-json';

const api = useApi();
const route = useRoute();
const router = useRouter();
const { useUserStore } = useStores();
const { isAdmin } = useUserStore();
const { notify } = useNotification();
const frontOfficeStore = useFrontOfficeStore();

const confirmExecute = ref(false);
const primaryKey = route.params.id as string;
const modelValue: Ref<Record<string, any>> = ref({ options: {} });
const initialValues: Ref<Record<string, any>> = ref({
	name: '',
	timeout: 10000,
	query: null,
	options: null,
	refresh_on_load: false,
});
const executing = ref(false);

const { item, edits, getItem, saving, save, validationErrors, fieldsWithPermissions } = useItem(
	'cms_queries',
	primaryKey
);

if (primaryKey !== '+') {
	getItem().then(() => {
		initialValues.value = { ...item.value } || {};
		initialValues.value.output = isJson(initialValues.value?.output)
			? JSON.parse(initialValues.value.output)
			: initialValues.value?.output;
		modelValue.value = Object.assign({}, initialValues.value);
	});
}

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

const defaultFields = computed(() => {
	if (typeof formFields === 'function') {
		const ctx = { values: modelValue.value } as ExtensionOptionsContext;
		return formFields(ctx);
	}
	return formFields;
});

const selectedQuery = computed(() => {
	return queryConfigList.find((e) => e.id === modelValue.value?.query);
});

const displayExecute = computed(() => {
	return modelValue.value?.query !== 'json' && modelValue.value?.query !== 'js-object';
});

async function execute() {
	try {
		if (hasEdits.value) {
			confirmExecute.value = true;
			return;
		}

		executing.value = true;
		const responseExecute = await api.patch(`/front-office/queries/${route.params.id}/execute`);
		modelValue.value.output = responseExecute?.data;

		await api.patch(`/items/cms_queries/${route.params.id}`, { output: modelValue.value.output });

		notify({ title: 'Item executed!' });
	} catch {
		//
	} finally {
		executing.value = false;
	}

	await getLogs();
}

async function update() {
	try {
		edits.value = { ...initialValues.value, ...modelValue.value, ...modelValue.value.options };
		fieldsWithPermissions.value = [...defaultFields.value, ...optionsFields.value];

		if (selectedQuery.value?.beforeSave) {
			edits.value = selectedQuery.value.beforeSave(edits.value);
		}

		await save();
		initialValues.value = { ...modelValue.value };
	} catch {
		//
	}
}

async function getLogs() {
	if (!route.params.id) return;

	const query = {
		params: { filter: { _and: [{ action: { _eq: 'execute ' } }, { item: { _eq: route.params.id } }] } },
	};

	await frontOfficeStore.getLogListByQuery(query);
}

async function updateAndExecute() {
	await update();
	await execute();
	confirmExecute.value = false;
}

async function updateAndNavigate() {
	await update();
	isEmpty(validationErrors.value) && router.push('/front-office/queries');
}
</script>

<style scoped>
.field-fault {
	padding-bottom: 1.25rem;
}
</style>
