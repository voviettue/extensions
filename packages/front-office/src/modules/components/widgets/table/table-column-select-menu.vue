<template>
	<v-menu show-arrow placement="bottom-end">
		<template #activator="{ toggle }">
			<v-icon clickable name="more_vert" @click="toggle" />
		</template>

		<v-list>
			<v-list-item clickable @click="$emit('openDetail')">
				<v-list-item-icon><v-icon name="edit" /></v-list-item-icon>
				<v-list-item-content>Edit</v-list-item-content>
			</v-list-item>

			<v-divider />

			<v-list-item clickable class="danger" @click="$emit('delete')">
				<v-list-item-icon><v-icon name="delete" /></v-list-item-icon>
				<v-list-item-content>Delete</v-list-item-content>
			</v-list-item>
		</v-list>
	</v-menu>
</template>

<script lang="ts">
export default {
	props: {
		column: {
			type: Object,
			required: true,
		},
		noDuplicate: {
			type: Boolean,
			default: false,
		},
		noDelete: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['delete', 'openDetail'],
};
</script>
<style scoped>
.v-list-item.danger {
	--v-list-item-color: var(--danger);
	--v-list-item-color-hover: var(--danger);
	--v-list-item-icon-color: var(--danger);
}
</style>
