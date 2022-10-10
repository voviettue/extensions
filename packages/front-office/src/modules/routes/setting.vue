<template>
	<private-view title="Project Settings">
		<template #headline>
			<v-breadcrumb :items="[{ name: 'Settings', to: '/front-office/settings' }]" />
		</template>

		<template #title-outer:prepend>
			<v-button class="header-icon" rounded disabled icon secondary>
				<v-icon name="settings" />
			</v-button>
		</template>

		<template #actions>
			<v-button rounded icon :loading="saving" @click="saveHandler">
				<v-icon name="check" />
			</v-button>
		</template>

		<template #navigation>
			<navigation></navigation>
		</template>

		<div class="padding-box cms-settings-body">
			<v-form
				v-model="edits"
				:loading="loading"
				:initial-values="item"
				:fields="formFields"
				:primary-key="item?.id"
				:validation-errors="validationErrors"
			/>
			<v-form
				v-model="edits.menu_options"
				:loading="loading"
				:initial-values="item"
				:fields="menuFields"
				:primary-key="item?.id"
				:validation-errors="validationErrors"
			/>
		</div>
	</private-view>
</template>

<script lang="ts" setup>
import Navigation from '../components/navigation.vue';
import { useFrontOfficeStore } from '../stores/front-office';
import { formFields, menuFields } from '../constants/setting';
import { useItem } from '../composables/use-item';
import { useValidate } from '../composables/use-validate';

const collection = 'cms_settings';
const { validateItem } = useValidate();
const frontOfficeStore = useFrontOfficeStore();
frontOfficeStore.hydrate();

const { item, edits, save, loading, saving, validationErrors, getItem } = useItem(collection, '');
getItem().then(() => {
	edits.value = { ...item.value };
});

async function saveHandler() {
	validationErrors.value = validateItem(edits.value, formFields);
	if (validationErrors.value.length) return;

	try {
		await save();
		edits.value = { ...item.value };
	} catch (err) {
		// do nothing
	}
}
</script>

<style lang="scss">
.cms-settings-body {
	--content-padding-bottom: 32px;
	padding: var(--content-padding);
	padding-top: 0;

	.v-divider {
		margin: 0px !important;
	}
}
</style>
