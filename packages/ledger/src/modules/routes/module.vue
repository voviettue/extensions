<template>
	<private-view v-if="loading">
		<div class="padding-box">
			<v-progress-circular />
		</div>
	</private-view>
	<router-view v-else class="module-ledger"></router-view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

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
