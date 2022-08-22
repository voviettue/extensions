<template>
	<div>
		<v-menu show-arrow placement="bottom-end">
			<template #activator="{ toggle }">
				<v-icon name="more_vert" clickable class="ctx-toggle" @click.prevent="toggle" />
			</template>
			<v-list>
				<!-- <v-list-item v-if="page.id" clickable :to="`/front-office/pages/${page.id}`">
					<v-list-item-icon>
						<v-icon name="box" />
					</v-list-item-icon>
					<v-list-item-content>View content</v-list-item-content>
				</v-list-item> -->

				<v-list-item v-if="isAdmin" clickable @click="updateVisiable(page)">
					<template v-if="page.hidden === true">
						<v-list-item-icon><v-icon name="visibility_off" /></v-list-item-icon>
						<v-list-item-content>Make Collection Visible</v-list-item-content>
					</template>
					<template v-else>
						<v-list-item-icon><v-icon name="visibility" /></v-list-item-icon>
						<v-list-item-content>Make Collection Hidden</v-list-item-content>
					</template>
				</v-list-item>

				<v-list-item v-if="isAdmin" clickable class="danger" @click="deletePage(page)">
					<v-list-item-icon>
						<v-icon name="delete" />
					</v-list-item-icon>
					<v-list-item-content>Delete Page</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-menu>
	</div>
</template>
<script setup lang="ts">
import { useStores } from '@directus/extensions-sdk';
const { useUserStore } = useStores();
const { isAdmin } = useUserStore();
withDefaults(defineProps<{ page: Record<string, any>; updateVisiable: Function; deletePage: Function }>(), {
	page: () => ({
		endpoint: '',
		hidden: false,
		id: null,
		name: '',
		title: '',
	}),
});
</script>
<style scoped>
.ctx-toggle {
	position: absolute !important;
	top: 7px;
	right: 20px;
}
.danger {
	color: red;
}
</style>
