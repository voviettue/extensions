<template>
	<private-view title="Menus">
		<template #headline>
			<v-breadcrumb :items="[{ name: 'Menus', to: '/front-office/menus' }]" />
		</template>

		<template #title-outer:prepend>
			<v-button class="header-icon" rounded disabled icon secondary>
				<v-icon name="settings" />
			</v-button>
		</template>

		<template #sidebar>
			<sidebar-detail icon="info" :title="t('information')" close></sidebar-detail>
		</template>

		<template #actions>
			<v-button v-tooltip.bottom="`Create New Menu`" rounded icon to="/front-office/menus/+" :disabled="!isAdmin">
				<v-icon name="add" />
			</v-button>
		</template>

		<template #navigation>
			<navigation></navigation>
		</template>

		<div>
			<menu-list :menus="item?.menus" :project-id="item?.id" />
		</div>
	</private-view>
</template>

<script lang="ts" setup>
import Navigation from '../components/navigation.vue';
import MenuList from '../components/menus/menu-list.vue';
import { useItem } from '../composables/use-item';
import { useStores } from '@directus/extensions-sdk';
import { useI18n } from 'vue-i18n';

const { useUserStore } = useStores();
const { isAdmin } = useUserStore();
const { t } = useI18n();
const collection = 'cms_settings';
const { item, getItem } = useItem(collection, '');
getItem();
</script>

<style>
.v-form {
	padding: var(--content-padding);
	padding-bottom: var(--content-padding-bottom);
}
.padding-box {
	padding: var(--content-padding);
	padding-top: 0;
}
</style>
