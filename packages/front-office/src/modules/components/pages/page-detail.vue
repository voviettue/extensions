<template>
	<private-view title="Page Detail">
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
			<v-button v-tooltip.bottom="`Save`" rounded icon :disabled="!isAdmin" @click="savePage">
				<v-icon name="check" />
			</v-button>
		</template>
		<div class="padding-box page-detail-container">
			<WidgetList :widgets="item?.widgets" />
		</div>
		<v-form
			v-model="edits"
			:loading="loading"
			:initial-values="item"
			:disabled="!isAdmin"
			:fields="formFields"
			:primary-key="item?.id"
			:validation-errors="validationErrors"
		/>
	</private-view>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue';
import Navigation from '../navigation.vue';
import { useStores } from '@directus/extensions-sdk';
import { useRoute, useRouter } from 'vue-router';
import { useItem } from '../../composables/use-item';
import WidgetList from '../widgets/widget-list.vue';
import { formFields } from '../../constants/page';
import { useValidate } from '../../composables/use-validate';

const { useUserStore } = useStores();
const { isAdmin } = useUserStore();
const route = useRoute();
const router = useRouter();
const { validateItem } = useValidate();

const collection = 'cms_pages';
const primaryKey = computed(() => {
	return route.params.id;
});

const { edits, item, save, validationErrors, loading, refresh, getItem } = useItem(
	collection,
	primaryKey.value as string
);

watch(item, () => {
	edits.value = { ...item.value };
});

watch(
	() => edits.value.endpoint,
	(val: string) => {
		if (!val?.startsWith('/')) edits.value.endpoint = `/${val || ''}`;
	}
);

async function savePage() {
	validationErrors.value = validateItem(edits.value, formFields);
	if (validationErrors.value.length) return;

	await save();
	if (!validationErrors.value.length) {
		refresh();
		router.push('/front-office/pages');
	}
}
onMounted(() => {
	getItem();
});
</script>

<style>
.padding-box {
	padding: var(--content-padding);
	padding-top: 0;
}
.padding-box .page-detail-container {
	width: 100%;
	padding: 20px;
	display: flex;
	justify-content: center;
}
</style>
