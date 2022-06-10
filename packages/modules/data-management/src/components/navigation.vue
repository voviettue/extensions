<template>
	<v-list nav>
		<v-list-item v-for="item in navItems" :key="item.to" :to="item.to">
			<v-list-item-icon>
				<v-icon :name="item.icon"></v-icon>
			</v-list-item-icon>
			<v-list-item-content>
				<v-text-overflow :text="item.name" />
			</v-list-item-content>
		</v-list-item>
	</v-list>
</template>

<script>
export default {
	computed: {
		navItems() {
			return [
				{
					icon: 'file_upload',
					name: 'Import Data',
					to: '/import',
				},
				{
					icon: 'file_download',
					name: 'Export Data',
					to: '/export',
				},
			];
		},
	},
};
</script>
