<template>
	<private-view title="Documents Detail">
		<template #headline>
			<v-breadcrumb :items="[{ name: 'Docs', to: '/ledger/documents' }]" />
		</template>

		<template #title-outer:prepend>
			<v-button class="header-icon" rounded disabled icon secondary>
				<v-icon name="star" />
			</v-button>
		</template>

		<template #navigation>
			<navigation></navigation>
		</template>

		<template v-if="loading">
			<div class="padding-box progress-circular">
				<v-progress-circular />
			</div>
		</template>

		<template v-if="!loading">
			<div class="padding-box">
				<div v-if="isDeleted" style="display: flex">
					<span class="badge">Deleted</span>
				</div>
				<v-table
					v-model:headers="headers"
					class="table"
					collection="classes"
					must-sort
					:items="items"
					:limit="1"
				></v-table>
			</div>
		</template>
	</private-view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useApi } from '@directus/extensions-sdk';
import Navigation from '../navigation.vue';
import union from 'lodash/union';
import startCase from 'lodash/startCase';
import format from 'date-fns/format';

const api = useApi();
const route = useRoute();

const primaryKey = route.params.id as string;
const docs = ref([]);
const loading = ref(false);

const items = computed(() => {
	return docs.value?.map((e: any) => {
		return {
			updateAt: format(new Date(e?.metadata?.tx_time), 'MM/dd/yyyy HH:mm'),
			...e?.data,
		};
	});
});

const isDeleted = computed(() => {
	const lastItem: any = docs.value?.slice(-1);
	return !lastItem[0]?.data;
});

const headers = computed(() => {
	let keys = [];
	items.value?.forEach((e: any) => {
		keys = union(keys, Object.keys(e));
	});

	return keys?.map((e: any) => ({
		align: 'left',
		sortable: true,
		text: startCase(e),
		value: e,
		width: null,
	}));
});

async function getItem() {
	try {
		loading.value = true;
		const response = await api.get(`/ledger/docs/${primaryKey}`);
		docs.value = response?.data?.data || [];
	} catch (err: any) {
		//
	} finally {
		loading.value = false;
	}
}

getItem();
</script>

<style scoped lang="scss">
.progress-circular {
	display: flex;
	justify-content: center;
}
.badge {
	--tw-text-opacity: 1;
	--tw-bg-opacity: 1;
	color: rgb(155 28 28 / var(--tw-text-opacity));
	font-weight: 600;
	font-size: 0.85rem;
	background-color: rgb(253 232 232 / var(--tw-bg-opacity));
	border-radius: 0.25rem;
	margin-right: 0.5rem;
	padding: 2px 12px;
}
</style>
