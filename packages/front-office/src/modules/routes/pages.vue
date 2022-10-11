<template>
	<private-view title="Pages">
		<template #headline>
			<v-breadcrumb :items="[{ name: 'Pages', to: '/front-office/pages' }]" />
		</template>

		<template #title-outer:prepend>
			<v-button class="header-icon" rounded disabled icon secondary>
				<v-icon name="article" />
			</v-button>
		</template>

		<template #navigation>
			<navigation></navigation>
		</template>
		<template #actions>
			<v-button v-tooltip.bottom="`Create New Page`" rounded icon to="/front-office/pages/+" :disabled="!isAdmin">
				<v-icon name="add" />
			</v-button>
		</template>
		<div class="padding-box">
			<page-list></page-list>
		</div>
	</private-view>
</template>

<script>
import Navigation from '../components/navigation.vue';
import PageList from '../components/pages/page-list.vue';
import { useStores } from '@directus/extensions-sdk';
export default {
	components: { Navigation, PageList },
	setup() {
		//
		const { useUserStore } = useStores();
		const { isAdmin } = useUserStore();
		return { isAdmin };
	},
};
</script>

<style>
.padding-box {
	padding: var(--content-padding);
}
</style>
