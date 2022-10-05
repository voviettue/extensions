<template>
	<v-drawer
		title="Create New Page"
		model-value
		class="new-page"
		persistent
		@cancel="$router.push('/front-office/pages')"
	>
		<div class="new-page-container">
			<v-form v-model="edits" :fields="formFields" :initial-values="initForm" :validation-errors="validationErrors" />
		</div>
		<template #actions>
			<v-button v-tooltip.bottom="`Save`" rounded icon :loading="loading" @click="savePage">
				<v-icon name="check" />
			</v-button>
		</template>
	</v-drawer>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { formFields } from '../../constants/page';
import snakeCase from 'lodash/snakeCase';
import { useItem } from '../../composables/use-item';
import { useRouter } from 'vue-router';
import { useValidate } from '../../composables/use-validate';

const collection = 'cms_pages';
const primaryKey = '+';
const router = useRouter();
const { validateItem } = useValidate();
const { edits, save, validationErrors, loading, refresh } = useItem(collection, primaryKey);

const initForm = ref({
	endpoint: '',
	key: '',
	title: '',
	hidden: false,
});

watch(
	() => edits.value.title,
	(val) => {
		edits.value.key = snakeCase(val);
	}
);
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
</script>
<style scoped>
.new-page-container {
	padding: 20px;
}
.submit-page {
	margin-top: 20px;
}
</style>
