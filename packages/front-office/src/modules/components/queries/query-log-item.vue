<template>
	<div class="log-item">
		<div class="log-item-title">
			<div class="log-item-info" @click="emit('click', log)">
				<div>
					<v-icon class="header-icon" :name="logTheme.icon" />
					<span>{{ formatDate(log.timestamp) }}</span>
				</div>
				<span>{{ log.comment.name }}</span>
			</div>
			<a class="content-copy" href="#" @click.prevent="copyContent" @mouseleave="isCoppied = false">
				<v-icon v-if="!isCoppied" v-tooltip="'Copy'" name="content_copy" />
				<v-icon v-if="isCoppied" v-tooltip="'Copied'" name="content_copy" />
			</a>
		</div>

		<transition-expand v-show="selected">
			<div class="log-item-detail">{{ log.comment }}</div>
		</transition-expand>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref, computed } from 'vue';

interface Props {
	log: any;
	selected: boolean;
}
const props = withDefaults(defineProps<Props>(), {
	log: () => null,
	selected: false,
});

const emit = defineEmits(['click']);
const isCoppied = ref(false);

const { locale } = useI18n();

const logTheme = computed(() => {
	return {
		icon: !props.log.comment?.error ? 'check' : 'close',
		iconBackgroundColor: !props.log.comment?.error ? 'var(--success)' : 'var(--danger)',
		backgroundColor: !props.log.comment?.error ? '' : 'var(--danger-25)',
	};
});

function formatDate(timestamp: string) {
	return new Date(timestamp).toLocaleTimeString(locale.value);
}

function copyContent() {
	isCoppied.value = true;
	navigator.clipboard.writeText(JSON.stringify(props.log.comment));
}
</script>

<style scoped lang="scss">
.log-item {
	padding: 0.75rem 1.25rem;
	border-bottom: 1px solid var(--border-normal);
	background-color: v-bind('logTheme.backgroundColor');
}

.log-item-title {
	display: flex;
}

.log-item-info {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.header-icon {
		margin-right: 0.5rem;
		background-color: v-bind('logTheme.iconBackgroundColor');
		border-radius: 50%;
		color: var(--background-page);
	}
	> div {
		display: flex;
		align-items: center;
	}
}
.content-copy {
	&:hover {
		color: black;
	}
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
	overflow-wrap: break-word;
	white-space: break-spaces;
	margin: 0.625rem 0.75rem;
	padding: 0 0.625rem;
	border-left: 1px solid var(--border-normal);
	font-family: var(--family-monospace);
}
</style>
