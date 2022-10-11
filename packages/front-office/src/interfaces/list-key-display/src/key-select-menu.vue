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

			<v-list-item clickable @click="$emit('toggleVisibility')">
				<template v-if="hidden === false">
					<v-list-item-icon><v-icon name="visibility_off" /></v-list-item-icon>
					<v-list-item-content>Hide</v-list-item-content>
				</template>
				<template v-else>
					<v-list-item-icon><v-icon name="visibility" /></v-list-item-icon>
					<v-list-item-content>Show</v-list-item-content>
				</template>
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
import { computed } from 'vue';
import get from 'lodash/get';

export default {
	props: {
		item: {
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
	emits: ['toggleVisibility', 'delete', 'openDetail'],
	setup(props) {
		const hidden = computed(() => {
			return get(props.item, 'hidden', false);
		});

		return { hidden };
	},
};
</script>
<style scoped>
.v-list-item.danger {
	--v-list-item-color: var(--danger);
	--v-list-item-color-hover: var(--danger);
	--v-list-item-icon-color: var(--danger);
}
</style>
