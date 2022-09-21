<template>
	<div>
		<v-info v-if="listQueries.length === 0" icon="web" title="No Query">
			<template #append>
				<v-button to="/front-office/queries/+">Create Query</v-button>
			</template>
		</v-info>

		<v-list v-else>
			<draggable
				:force-fallback="true"
				:model-value="listQueries"
				:group="{ name: 'queries' }"
				:swap-threshold="0.3"
				class="root-drag-container"
				item-key="query"
				handle=".drag-handle"
			>
				<template #item="{ element }">
					<query-item :query="element" @refresh="getListQuery()"></query-item>
				</template>
			</draggable>
		</v-list>
		<router-view name="add"></router-view>
	</div>
</template>

<script setup lang="ts">
import { useApi } from '@directus/extensions-sdk';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Draggable from 'vuedraggable';
import QueryItem from './query-item.vue';

const route = useRoute();
const api = useApi();

const listQueries = ref([]);

watch(
	() => route.name,
	(val) => {
		if (val === 'front-office-query') {
			getListQuery();
		}
	}
);

getListQuery();

async function getListQuery() {
	try {
		const queriesApiData = await api.get('/items/cms_queries');
		listQueries.value = queriesApiData?.data?.data || [];
	} catch {
		//
	}
}
</script>
