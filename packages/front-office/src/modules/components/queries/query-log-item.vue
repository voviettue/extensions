<template>
	<div class="log-item">
		<div class="log-item-info" @click="emit('click', log)">
			<div>
				<v-icon :name="logTheme.icon" />
				<span>{{ formatDate(log.timestamp) }}</span>
			</div>
			<span>{{ log.comment.name }}</span>
		</div>
		<transition-expand v-show="selected">
			<div class="log-item-detail">{{ log.comment }}</div>
		</transition-expand>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

interface Props {
	log: any;
	selected: boolean;
}
const props = withDefaults(defineProps<Props>(), {
	log: () => null,
	selected: false,
});

const emit = defineEmits(['click']);

const { locale } = useI18n();

const logTheme = computed(() => {
	return {
		icon: props.log.comment?.data ? 'check' : 'close',
		iconBackgroundColor: props.log.comment?.data ? 'var(--success)' : 'var(--danger)',
		backgroundColor: props.log.comment?.data ? '' : 'var(--danger-25)',
	};
});

function formatDate(timestamp: string) {
	return new Date(timestamp).toLocaleTimeString(locale.value);
}
</script>

<style scoped>
.log-item {
	padding: 0.75rem 1.25rem;
	border-bottom: 1px solid var(--border-normal);
	background-color: v-bind('logTheme.backgroundColor');
}
.log-item-info {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.log-item-info > div {
	display: flex;
	align-items: center;
}

.log-item-info .v-icon {
	margin-right: 0.5rem;
	background-color: v-bind('logTheme.iconBackgroundColor');
	border-radius: 50%;
	color: var(--background-page);
}

.v-icon :deep(i) {
	display: flex;
	font-size: 1.25rem;
	width: 100%;
	height: 100%;
	justify-content: center;
	align-items: center;
}
.log-item-detail {
	white-space: break-spaces;
	margin: 0.625rem 0.75rem;
	padding: 0 0.625rem;
	border-left: 1px solid var(--border-normal);
	font-family: var(--family-monospace);
}
</style>
