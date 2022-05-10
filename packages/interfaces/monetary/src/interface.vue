<template>
	<div>
		<v-input
			:autofocus="autofocus"
			:placeholder="placeholder"
			:disabled="disabled"
			:trim="true"
			type="number"
			:db-safe="dbSafe"
			:model-value="value"
			@update:model-value="emitValue"
		>
			<template v-if="currency.prefix" #prepend>{{ currency.symbol }}</template>
			<template v-else #append>{{ currency.symbol }}</template>
		</v-input>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStores } from '@directus/extensions-sdk';
import currencies from './currencies.json';

export default defineComponent({
	props: {
		value: {
			type: Number,
			default: null,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		placeholder: {
			type: String,
			default: null,
		},
		dbSafe: {
			type: Boolean,
			default: false,
		},
		autofocus: {
			type: Boolean,
			default: false,
		},
		currency: {
			type: String,
			default: null,
		},
	},
	emits: ['input'],
	setup(props, { emit }) {
		const { useSettingsStore } = useStores();
		const settingsStore = useSettingsStore();

		const currency = computed(() => {
			const currencyCode = props.currency || settingsStore.settings?.default_currency;
			return currencies.find((el) => el.code === currencyCode);
		});

		return { emitValue, currency };

		function emitValue(value: number): void {
			const parsedNumber = Number(value);

			// Ignore if numeric value remains unchanged
			if (parsedNumber && props.value !== parsedNumber) {
				emit('input', parsedNumber);
			}
		}
	},
});
</script>
