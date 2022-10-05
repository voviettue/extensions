<template>
	<div>
		<v-info v-if="queries.length === 0" icon="web" title="No Query">
			<template #append>
				<v-button to="/front-office/queries/+">Create Query</v-button>
			</template>
		</v-info>

		<v-list v-else>
			<draggable
				:force-fallback="true"
				:model-value="queries"
				:group="{ name: 'queries' }"
				:swap-threshold="0.3"
				class="root-drag-container"
				item-key="query"
				handle=".drag-handle"
			>
				<template #item="{ element }">
					<query-item :query="element" @refresh="refresh()"></query-item>
				</template>
			</draggable>
		</v-list>
		<router-view name="add"></router-view>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import Draggable from 'vuedraggable';
import { useFrontOfficeStore } from '../../stores/front-office';
import QueryItem from './query-item.vue';

const route = useRoute();
const store = useFrontOfficeStore();
const { queries } = storeToRefs(store);

watchEffect(() => {
	if (route.name === 'front-office-query') {
		refresh();
	}
});

function refresh() {
	store.hydrateQueries();
}
</script>
