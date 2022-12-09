<template>
	<private-view v-if="loading">
		<div class="padding-box">
			<v-progress-circular />
		</div>
	</private-view>
	<router-view v-else class="module-ledger"></router-view>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useLedgerStore } from '../stores/ledger';
import { storeToRefs } from 'pinia';

const ledgerStore = useLedgerStore();
const { connection } = storeToRefs(ledgerStore);
let interval;

onMounted(async () => {
	try {
		interval = window.setInterval(async () => {
			await ledgerStore.healthCheck();
		}, 30000);
	} catch (e) {
		//
	}
});

onUnmounted(() => {
	clearInterval(interval);
});

const loading = ref(false);
</script>

<style lang="scss">
.module-ledger {
	--form-horizontal-gap: 32px;
	--form-vertical-gap: 32px;

	#main-content {
		padding-bottom: 100px;
	}

	.v-form {
		--content-padding: 32px;
		--content-padding-bottom: 32px;
	}

	.v-divider {
		margin: 0px !important;
	}
}
</style>
