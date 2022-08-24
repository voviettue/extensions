<template>
	<private-view title="Project Settings">
		<template #headline>
			<v-breadcrumb :items="[{ name: 'Settings', to: '/front-office/settings' }]" />
		</template>

		<template #title-outer:prepend>
			<v-button class="header-icon" rounded disabled icon secondary>
				<v-icon name="settings" />
			</v-button>
		</template>

		<template #actions>
			<v-button rounded icon :loading="saving" @click="saveAndRefresh">
				<v-icon name="check" />
			</v-button>
		</template>

		<template #navigation>
			<navigation></navigation>
		</template>

		<menu-list :menus="item?.menus" :project-id="item?.id" />

		<v-form v-model="edits" :loading="loading" :initial-values="item" :fields="formFields" :primary-key="item?.id" />
	</private-view>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';

import Navigation from '../components/navigation.vue';
import MenuList from '../components/settings/menu-list.vue';
import { useApi } from '@directus/extensions-sdk';
import { getEndpoint } from '@directus/shared/utils';
import { useNotification } from '../composables/use-notification';
import { useFrontOfficeStore } from '../stores/front-office';
import { formFields } from '../constants/setting';

export default {
	components: { Navigation, MenuList },
	setup() {
		const collection = 'cms_settings';
		const api = useApi();
		const { notify } = useNotification();
		const frontOfficeStore = useFrontOfficeStore();
		frontOfficeStore.hydrate();

		const item = ref();
		const edits = ref();
		const error = ref();
		const loading = ref<boolean>(false);
		const saving = ref<boolean>(false);

		onMounted(async () => {
			await refresh();
		});

		return {
			collection,
			item,
			loading,
			error,
			edits,
			saving,
			refresh,
			saveAndRefresh,
			formFields,
		};

		async function saveAndRefresh() {
			try {
				await save();
				refresh();
			} catch {
				// Save shows unexpected error dialog
			}
		}

		async function getItem() {
			loading.value = true;
			error.value = null;

			try {
				const response = await api.get(getEndpoint(collection), {
					params: {
						fields: ['*', 'menus.*'],
					},
				});
				item.value = { ...response.data.data };
			} catch (err) {
				error.value = err;
			} finally {
				loading.value = false;
			}
		}

		async function save() {
			saving.value = true;

			try {
				let response = await api.patch(getEndpoint(collection), edits.value);

				notify({ title: 'Settings updated' });

				item.value = { ...response.data.data };
				edits.value = {};

				return response.data.data;
			} catch (err: any) {
				// eslint-disable-next-line no-console
				console.log(err);
			} finally {
				saving.value = false;
			}
		}

		async function refresh() {
			error.value = null;
			loading.value = false;
			saving.value = false;

			await getItem();
		}
	},
};
</script>

<style>
.v-form {
	padding: var(--content-padding);
	padding-bottom: var(--content-padding-bottom);
}
.padding-box {
	padding: var(--content-padding);
	padding-top: 0;
}
</style>
