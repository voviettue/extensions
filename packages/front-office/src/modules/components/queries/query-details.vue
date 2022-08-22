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
			<v-button v-tooltip.bottom="'Save'" rounded icon :disabled="!isAdmin" @click="saveQuery">
				<v-icon name="check" />
			</v-button>
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
	</private-view>
</template>

<script setup lang="ts">
import Navigation from '../navigation.vue';
import { useApi, useStores } from '@directus/extensions-sdk';
import { useRoute, useRouter } from 'vue-router';
import { onBeforeMount, ref, Ref, computed, watch } from 'vue';
import { useValidate } from '../../composables/use-validate';
import { formFields } from '../../constants/query';
import { ExtensionOptionsContext } from '../../types/extensions';
import queryConfigList from '../../queries';
import snakeCase from 'lodash/snakeCase';
import ExtensionOptionsComponent from '../shared/extension-options.vue';

const api = useApi();
const route = useRoute();
const router = useRouter();
const { useUserStore } = useStores();
const { isAdmin } = useUserStore();
const { validateItem } = useValidate();

const modelValue: Ref<Record<string, any>> = ref({ options: {} });
const validationErrors: Ref<Record<string, any>[]> = ref([]);
const isLoading = ref(false);
const initialValues = ref({
	name: '',
	timeout: 10000,
	query: null,
	options: null,
	refresh_on_load: false,
});

watch(
	() => modelValue.value.name,
	(val) => {
		modelValue.value.key = snakeCase(val);
	}
);

const optionsFields = computed(() => {
	const query = queryConfigList.find((e) => modelValue.value.query === e.id);
	const options = query?.options || [];
	if (typeof options === 'function') {
		const ctx = { values: modelValue.value } as ExtensionOptionsContext;
		return options(ctx);
	}

	return options;
});

async function getDetailPage() {
	try {
		const resQueryDetails = await api.get(`/items/cms_queries/${route.params.id}`);
		modelValue.value = { ...resQueryDetails?.data?.data } || {};
	} catch {
		//
	}
}

async function saveQuery() {
	validationErrors.value = [];
	const dataForm = { ...modelValue.value, ...modelValue.value.options };
	validationErrors.value = validateItem(dataForm, [...formFields, ...optionsFields.value]);
	if (validationErrors.value.length) return;

	isLoading.value = true;

	try {
		await api.patch(`/items/cms_queries/${route.params.id}`, modelValue.value);
		router.push('/front-office/queries');
	} catch {
		//
	} finally {
		isLoading.value = false;
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
