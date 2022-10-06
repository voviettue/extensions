<template>
	<private-view v-if="loading">
		<div class="padding-box">
			<v-progress-circular />
		</div>
	</private-view>
	<router-view v-else class="module-front-office"></router-view>
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

<style scoped>
.module-front-office {
	--form-horizontal-gap: 32px;
	--form-vertical-gap: 32px;
}
</style>
