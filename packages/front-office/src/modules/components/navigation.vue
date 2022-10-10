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
					icon: 'settings',
					name: 'Project Settings',
					to: '/front-office/settings',
				},
				{
					icon: 'menu',
					name: 'Menus',
					to: '/front-office/menus',
				},
				{
					icon: 'article',
					name: 'Pages',
					to: '/front-office/pages',
				},
				{
					icon: 'star',
					name: 'Queries',
					to: '/front-office/queries',
				},
			];
		},
	},
};
</script>
