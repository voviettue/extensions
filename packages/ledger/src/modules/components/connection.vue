<template>
	<div class="connection" :class="connection ? 'success' : 'error'"></div>
</template>

<script lang="ts" setup>
import { useLedgerStore } from '../stores/ledger';
import { storeToRefs } from 'pinia';

const ledgerStore = useLedgerStore();
const { connection } = storeToRefs(ledgerStore);
</script>

<style lang="scss">
.connection {
	border: 3px solid white;
	width: 1.25rem;
	height: 1.25rem;
	border-radius: 50%;
	position: absolute;
	right: 0;
	bottom: -5px;
}
.success {
	background-color: #42c258;
}
.error {
	background-color: red;
}
</style>
