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
			<v-button v-tooltip.bottom="`Save`" rounded icon :disabled="!isAdmin || !isEditing" @click="savePage">
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
		<v-form
			v-model="edits.options"
			:loading="loading"
			:initial-values="item"
			:disabled="!isAdmin"
			:fields="optionsFields"
			:primary-key="item?.id"
			:validation-errors="validationErrors"
			:nested="true"
		/>
	</private-view>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import Navigation from '../navigation.vue';
import { useStores } from '@directus/extensions-sdk';
import { useRoute } from 'vue-router';
import { useItem } from '../../composables/use-item';
import WidgetList from '../widgets/widget-list.vue';
import { formFields, optionsFields } from '../../constants/page';
import { useValidate } from '../../composables/use-validate';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

const { useUserStore } = useStores();
const { isAdmin } = useUserStore();
const route = useRoute();
const { validateItem } = useValidate();

const collection = 'cms_pages';
const primaryKey = computed(() => {
	return route.params.id;
});

const { edits, item, save, validationErrors, loading, getItem } = useItem(collection, primaryKey.value as string);

const isEditing = computed(() => {
	return !isEqual(edits.value, item.value);
});

getItem().then(() => {
	edits.value = cloneDeep(item.value);
});

watch(item, () => {
	edits.value = cloneDeep(item.value);
});

async function savePage() {
	validationErrors.value = validateItem(edits.value, formFields);
	if (validationErrors.value.length) return;

	if (!edits.value.endpoint?.startsWith('/')) {
		edits.value.endpoint = `/` + edits.value.endpoint;
	}

	await save();
}
</script>

<style>
.padding-box {
	padding: var(--content-padding);
}
.padding-box .page-detail-container {
	--form-vertical-gap: 2rem;
	width: 100%;
	padding: 20px;
	display: flex;
	justify-content: center;
}
</style>
