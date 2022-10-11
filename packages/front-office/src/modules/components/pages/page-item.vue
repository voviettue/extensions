<template>
	<div class="page">
		<v-list-item
			block
			dense
			clickable
			:class="{ hidden: page.hidden }"
			:to="page.id ? `/front-office/pages/${page.id}` : undefined"
			@click.self="null"
		>
			<v-list-item-icon>
				<v-icon class="drag-handle" name="drag_handle" />
			</v-list-item-icon>
			<div class="line">
				<v-icon
					:color="page.hidden ? 'var(--foreground-subdued)' : page.color ?? 'var(--primary)'"
					class="icon"
					:name="page.hidden ? 'visibility_off' : 'article'"
				/>
				<span :class="`endpoint ${page.hidden ? 'hidden' : ''}`">{{ page.endpoint }}</span>
				<v-text-overflow class="title" :text="page.title" />
			</div>
			<page-options :page="page" :update-visiable="updateVisiable" :delete-page="deletePage" />
		</v-list-item>
	</div>
</template>
<script setup lang="ts">
import PageOptions from './page-options.vue';
withDefaults(defineProps<{ page: Record<string, any>; updateVisiable: Function; deletePage: Function }>(), {
	page: () => ({
		endpoint: '',
		hidden: false,
		id: null,
		key: '',
		title: '',
	}),
});
</script>
<style scoped lang="scss">
.page {
	margin-bottom: 10px;
	.line {
		flex-grow: 1;
		display: flex;
		align-items: center;
	}
	.icon {
		margin-right: 10px;
	}
	.endpoint.hidden {
		color: #ccc;
		opacity: 0.5;
	}
	.title {
		color: var(--foreground-subdued) !important;
		font-family: var(--family-monospace);
		transition: opacity var(--fast) var(--transition);
		opacity: 0;
		margin-left: 8px;
	}
	&:hover .title {
		opacity: 1;
	}
}
.page :deep(.ctx-toggle) {
	right: 8px;
	top: 8px;
}
</style>
