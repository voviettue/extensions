<template>
	<v-list nav>
		<v-list-item v-for="item in navItems" :key="item.to" :to="item.to">
			<v-list-item-icon><v-icon :name="item.icon"></v-icon></v-list-item-icon>
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
					icon: 'credit_card',
					name: 'Billing',
					to: '/workspace/billing',
				},
			];
		},
	},
};
</script>
