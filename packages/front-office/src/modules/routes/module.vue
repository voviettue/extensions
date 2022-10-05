<template>
	<private-view v-if="loading">
		<div class="padding-box">loading...</div>
	</private-view>
	<router-view v-else></router-view>
</template>

<script lang="ts" setup>
import { useFrontOfficeStore } from '../stores/front-office';
import { onMounted, ref } from 'vue';

const loading = ref(true);

onMounted(async () => {
	const store = useFrontOfficeStore();
	if (!store.hydrated) {
		await store.hydrate();
	}
	loading.value = false;
});
</script>
