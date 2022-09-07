<template>
	<div class="page-item">
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
			<div class="page-item-detail">
				<v-icon
					:color="page.hidden ? 'var(--foreground-subdued)' : page.color ?? 'var(--primary)'"
					class="page-icon"
					:name="page.hidden ? 'visibility_off' : 'article'"
				/>
				<span :class="`page-endpoint ${page.hidden ? 'hidden' : ''}`">{{ page.endpoint }}</span>
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
<style scoped>
.page-item {
	margin-bottom: 10px;
}
.page-icon {
	margin-right: 10px;
}
.page-endpoint.hidden {
	color: #ccc;
	opacity: 0.5;
}
</style>
