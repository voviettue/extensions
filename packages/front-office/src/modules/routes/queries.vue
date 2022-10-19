<template>
	<private-view title="Queries">
		<template #headline>
			<v-breadcrumb :items="[{ name: 'Queries', to: '/front-office/queries' }]" />
		</template>

		<template #title-outer:prepend>
			<v-button class="header-icon" rounded disabled icon secondary>
				<v-icon name="star" />
			</v-button>
		</template>

		<template #sidebar>
			<sidebar-detail icon="info" :title="t('information')" close></sidebar-detail>
		</template>

		<template #navigation>
			<navigation></navigation>
		</template>
		<template #actions>
			<v-button v-tooltip.bottom="`Create New Query`" rounded icon to="/front-office/queries/+" :disabled="!isAdmin">
				<v-icon name="add" />
			</v-button>
		</template>
		<div class="padding-box">
			<query-list />
		</div>
	</private-view>
</template>

<script>
import Navigation from '../components/navigation.vue';
import QueryList from '../components/queries/query-list.vue';
import { useStores } from '@directus/extensions-sdk';
import { useI18n } from 'vue-i18n';

export default {
	components: {
		Navigation,
		QueryList,
	},
	setup() {
		const { useUserStore } = useStores();
		const { isAdmin } = useUserStore();
		const { t } = useI18n();

		return {
			t,
			isAdmin,
		};
	},
};
</script>

<style>
.padding-box {
	padding: var(--content-padding);
}
</style>
