<template>
	<private-view title="Documents Detail">
		<template #headline>
			<v-breadcrumb :items="[{ name: 'Docs', to: '/ledger/documents' }]" />
		</template>

		<template #title-outer:prepend>
			<div class="position-relative">
				<v-button class="header-icon" rounded disabled icon secondary>
					<v-icon name="star" />
				</v-button>
				<connection />
			</div>
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
				<template v-if="collectionInActive">
					<span class="badge warn">Can not get document journal, collection was inactivated</span>
				</template>
				<template v-else>
					<div v-if="isDeleted" style="display: flex">
						<span class="badge danger">Deleted</span>
					</div>
					<v-table v-model:headers="headers" class="table" collection="classes" must-sort :items="items" :limit="1">
						<template v-for="header in headers" :key="header.value" #[`item.${header.value}`]="{ item }">
							<div :class="{ highlight: isDiff(item.version, header.value) }">{{ item[header.value] }}</div>
						</template>
					</v-table>
				</template>
			</div>
		</template>
	</private-view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useApi } from '@directus/extensions-sdk';
import Navigation from '../navigation.vue';
import Connection from '../connection.vue';
import union from 'lodash/union';
import startCase from 'lodash/startCase';
import format from 'date-fns/format';
import isEqual from 'lodash/isEqual';

const api = useApi();
const route = useRoute();

const primaryKey = route.params.id as string;
const docs = ref([]);
const loading = ref(false);
const collectionInActive = ref(false);

const items = computed(() => {
	return docs.value?.map((e: any) => {
		return {
			version: e?.metadata?.version,
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

	return keys
		?.map((e: any) => ({
			align: 'left',
			sortable: true,
			text: startCase(e),
			value: e,
			width: null,
		}))
		.filter((e) => e.value !== 'version');
});

async function getItem() {
	try {
		loading.value = true;
		const response = await api.get(`/ledger/docs/${primaryKey}`);
		docs.value = response?.data?.data || [];
	} catch (err: any) {
		const message = err?.response?.data?.message;
		collectionInActive.value = message?.includes('document journal');
	} finally {
		loading.value = false;
	}
}

function isDiff(index: number, field: string) {
	if (field === 'updateAt' || index === 0) return false;

	const currentValue = items.value[index][field];
	const prevValue = items.value[index - 1][field];

	return !isEqual(currentValue, prevValue);
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
	font-weight: 600;
	font-size: 0.85rem;
	border-radius: 0.25rem;
	margin-right: 0.5rem;
	padding: 2px 12px;
}

.warn {
	background-color: #ffe8ce;
	color: #ffa439;
}

.danger {
	background-color: rgb(253 232 232 / var(--tw-bg-opacity));
	color: rgb(155 28 28 / var(--tw-text-opacity));
}
.position-relative {
	position: relative;
}
.highlight {
	background-color: #cbf3e9;
	margin-left: -0.375rem;
	padding: 0 0.375rem;
	color: #2ecda7;
	border-radius: 6px;
}
</style>
