<template>
	<div class="query">
		<v-list-item block dense clickable :to="`/front-office/queries/${query.id}`">
			<v-list-item-icon>
				<v-icon class="drag-handle" name="drag_handle" />
			</v-list-item-icon>
			<div class="">
				<v-icon :name="queryIcon" class="icon" />
				<span class="name">{{ query.name }}</span>
				<span class="key">{{ query.key }}</span>
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

<style scoped lang="scss">
.query {
	margin-bottom: 10px;

	.name {
		margin: 8px;
	}
	.icon {
		margin-right: 2px;
	}
	.key {
		color: var(--foreground-subdued);
		font-family: var(--family-monospace);
		transition: opacity var(--fast) var(--transition);
		opacity: 0;
	}
	&:hover .key {
		opacity: 1;
	}
}
</style>
