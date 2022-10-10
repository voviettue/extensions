<template>
	<v-menu show-arrow placement="bottom-end">
		<template #activator="{ toggle }">
			<v-icon clickable name="more_vert" @click="toggle" />
		</template>

		<v-list>
			<v-list-item clickable @click="$router.push(`/front-office/settings/project/${item.project}/menu/${item.id}`)">
				<v-list-item-icon><v-icon name="edit" /></v-list-item-icon>
				<v-list-item-content>Edit</v-list-item-content>
			</v-list-item>

			<v-list-item :disabled="noDuplicate" clickable @click="emit('duplicate')">
				<v-list-item-icon>
					<v-icon name="content_copy" />
				</v-list-item-icon>
				<v-list-item-content>Duplicate</v-list-item-content>
			</v-list-item>

			<v-list-item clickable @click="emit('toggleVisibility')">
				<template v-if="item?.hidden === false">
					<v-list-item-icon><v-icon name="visibility_off" /></v-list-item-icon>
					<v-list-item-content>Hide</v-list-item-content>
				</template>
				<template v-else>
					<v-list-item-icon><v-icon name="visibility" /></v-list-item-icon>
					<v-list-item-content>Show</v-list-item-content>
				</template>
			</v-list-item>

			<v-divider />

			<v-list-item :disabled="noDelete" clickable class="danger" @click="emit('delete')">
				<v-list-item-icon><v-icon name="delete" /></v-list-item-icon>
				<v-list-item-content>Delete</v-list-item-content>
			</v-list-item>
		</v-list>
	</v-menu>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';

interface Props {
	item: Record<string, any>;
	noDuplicate?: boolean;
	noDelete?: boolean;
}

withDefaults(defineProps<Props>(), {
	noDuplicate: false,
	noDelete: false,
});

const emit = defineEmits(['toggleVisibility', 'duplicate', 'delete', 'openDetail']);
</script>
<style scoped>
.v-list-item.danger {
	--v-list-item-color: var(--danger);
	--v-list-item-color-hover: var(--danger);
	--v-list-item-icon-color: var(--danger);
}
</style>
