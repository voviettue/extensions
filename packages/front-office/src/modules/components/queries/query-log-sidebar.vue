<template>
	<sidebar-detail icon="star" :title="t('Query logs')">
		<div class="log-items">
			<query-log-item
				v-for="log in itemLogs"
				:key="log.id"
				class="log-item"
				:log="log"
				:selected="!!logSelected && logSelected.id === log.id"
				@click="onSelectLog(log)"
			></query-log-item>

			<v-button v-if="itemLogs.length > 0" :full-width="true" secondary class="action-clear" @click="deleteLogs">
				<v-icon name="delete" />
				<span>Clear All</span>
			</v-button>
		</div>
	</sidebar-detail>
</template>

<script setup lang="ts">
import { Ref, ref, computed, onMounted } from 'vue';
import { useApi } from '@directus/extensions-sdk';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useFrontOfficeStore } from '../../stores/front-office';
import QueryLogItem from './query-log-item.vue';

const { t } = useI18n();
const api = useApi();
const route = useRoute();
const frontOfficeStore = useFrontOfficeStore();

const logSelected: Ref<Record<string, any>> = ref({});

const itemLogs: Ref<Record<string, any>[]> = computed(() => frontOfficeStore.logList);

function onSelectLog(log: any) {
	logSelected.value = log !== logSelected.value ? log : null;
}

async function getLogs() {
	if (!route.params.id) return;

	const query = {
		params: { filter: { _and: [{ action: { _eq: 'execute ' } }, { item: { _eq: route.params.id } }] } },
	};

	await frontOfficeStore.getLogListByQuery(query);
}

async function deleteLogs() {
	try {
		await api.delete(`/front-office/queries/${route.params.id}/logs`);
	} catch {
		//
	}

	await getLogs();
}

onMounted(async () => {
	await getLogs();
});
</script>

<style scoped>
.sidebar-detail :deep(.content) {
	padding: 0;
}
.action-clear {
	margin-top: 0.5rem;
}
</style>
