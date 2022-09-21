<template>
	<div class="page-item">
		<v-list-item block dense clickable :to="`/front-office/queries/${query.id}`">
			<v-list-item-icon>
				<v-icon class="drag-handle" name="drag_handle" />
			</v-list-item-icon>
			<div class="">
				<v-icon :name="queryIcon" class="page-icon" />
				<span>{{ query.name }}</span>
			</div>
			<query-options :query="query" @refresh="emit('refresh')" />
		</v-list-item>
	</div>
</template>

<script setup lang="ts">
import queryConfigList from '../../queries';
import { computed } from 'vue';
import QueryOptions from './query-options.vue';

const emit = defineEmits(['refresh']);
const props = withDefaults(defineProps<{ query: Record<string, any> }>(), {
	query: () => ({
		id: null,
		name: '',
		options: null,
		output: null,
		query: null,
	}),
});

const queryIcon = computed(() => {
	const queryConfig = queryConfigList.find((e) => props.query.query === e.id);
	return queryConfig?.icon;
});
</script>

<style scoped>
.page-item {
	margin-bottom: 10px;
}
.page-icon {
	margin-right: 10px;
}
</style>
