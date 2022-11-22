<template>
	<private-view :title="`Collections ${isNew ? 'Create' : 'Update'}`">
		<template #headline>
			<v-breadcrumb :items="[{ name: 'Collections', to: '/ledger/collections' }]" />
		</template>

		<template #title-outer:prepend>
			<v-button class="header-icon" rounded disabled icon secondary>
				<v-icon name="article" />
			</v-button>
		</template>

		<template #navigation>
			<navigation></navigation>
		</template>

		<template #actions>
			<v-dialog v-if="!isNew" v-model="confirmDelete" :disabled="!isAdmin" @esc="confirmDelete = false">
				<template #activator="{ on }">
					<v-button
						v-if="collectionInfo.meta && collectionInfo.meta.singleton === false"
						v-tooltip.bottom="isAdmin ? t('delete_label') : t('not_allowed')"
						rounded
						icon
						class="action-delete"
						secondary
						:disabled="modelValue === null || !isAdmin"
						@click="on"
					>
						<v-icon name="delete" outline />
					</v-button>
				</template>

				<v-card>
					<v-card-title>{{ t('delete_are_you_sure') }}</v-card-title>

					<v-card-actions>
						<v-button secondary @click="confirmDelete = false">
							{{ t('cancel') }}
						</v-button>
						<v-button kind="danger" @click="deleteAndQuit">
							{{ t('delete_label') }}
						</v-button>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-button v-tooltip.bottom="isNew ? 'Create' : 'Update'" rounded icon @click="createOrUpdate">
				<v-icon name="check" />
			</v-button>
		</template>

		<div class="new-collection-container">
			<v-form
				v-model="modelValue"
				primary-key="+"
				class="field-fault"
				:fields="defaultFields"
				:initial-values="initialValues"
				:validation-errors="validationErrors"
			></v-form>
		</div>
	</private-view>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref, Ref, computed } from 'vue';
import { useApi } from '@directus/extensions-sdk';
import { useRoute, useRouter } from 'vue-router';
import { useNotification } from '../../composables/use-notification';
import { useValidate } from '../../composables/use-validate';
import { useCollection } from '@directus/shared/composables';
import { useStores } from '@directus/extensions-sdk';
import Navigation from '../navigation.vue';
import errorHandler from '../../utils/error-hander';
import isJson from '../../utils/is-json';
import fields from './fields';
import merge from 'lodash/merge';

const { t } = useI18n();
const api = useApi();
const router = useRouter();
const route = useRoute();
const { notify } = useNotification();
const { validateItem } = useValidate();
const { useUserStore } = useStores();
const { isAdmin } = useUserStore();

const modelValue: Ref<Record<string, any>> = ref({});
const primaryKey = ref(route.params.id as string);
const collection: Ref<string> = ref(route.params?.collection as string);
const initialValues = ref({
	collection: '',
	fields: [],
});
const validationErrors: Ref<Record<string, any>> = ref([]);
const confirmDelete = ref(false);

const { info: collectionInfo } = useCollection(collection.value);

const defaultFields = computed(() => {
	const options = fields.options;
	if (typeof options === 'function') {
		const ctx = { values: modelValue.value };
		return options(ctx);
	}

	return options;
});

const isNew = computed(() => !primaryKey.value);

async function createOrUpdate() {
	try {
		validationErrors.value = [];
		const errors = validateItem(merge({}, modelValue.value), defaultFields.value) || [];

		if (errors.length > 0) {
			validationErrors.value = errors;
			throw errors;
		}

		if (isNew.value) {
			await api.post(`/items/cms_ledger_collections`, modelValue.value);
			notify({ title: 'Item created!' });
		} else {
			await api.patch(`/items/cms_ledger_collections/${primaryKey.value}`, modelValue.value);
			notify({ title: 'Item updated!' });
		}

		router.push('/ledger/collections');
	} catch (err: any) {
		validationErrors.value = errorHandler(err, collectionInfo.value);
	}
}

async function getItem() {
	try {
		const response = await api.get(`/items/cms_ledger_collections/${primaryKey.value}`);
		initialValues.value = { ...response?.data?.data } || {};
		initialValues.value.fields = isJson(initialValues.value?.fields)
			? JSON.parse(initialValues.value.fields)
			: initialValues.value?.fields;
		modelValue.value = Object.assign({}, initialValues.value);
	} catch (err: any) {
		//
	}
}

async function deleteAndQuit() {
	try {
		await api.delete(`/items/cms_ledger_collections/${primaryKey.value}`);
		notify({ title: 'Item deleted!' });
		router.push('/ledger/collections');
	} catch (err: any) {
		//
	}
}

if (!isNew.value) {
	getItem();
}
</script>
