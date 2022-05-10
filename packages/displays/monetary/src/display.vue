<template>
	<span>{{ displayValue }}</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStores } from '@directus/extensions-sdk';
import currencies from './currencies.json';

export default defineComponent({
	props: {
		value: {
			type: String,
			default: null,
		},
		currency: {
			type: String,
			default: null,
		},
	},
	setup(props) {
		const { useSettingsStore } = useStores();
		const settingsStore = useSettingsStore();
		const currencyCode = props.currency || settingsStore.settings?.default_currency;

		const currency = currencies.find((el) => el.code === currencyCode);
		const floatValue = parseFloat(props.value);

		let sign = floatValue < 0 ? '-' : '';
		let symbol = '';
		let spacing = '';
		let number = '';

		symbol = currency?.symbol || '';
		spacing = currency?.spacer ? ' ' : '';
		const absValue = Math.abs(floatValue);
		number = formatNumber(
			absValue,
			currency?.decimals,
			currency?.thousandsSeparator,
			currency?.decimalsSeparator,
		);

		const displayValue = currency?.prefix ? `${sign}${symbol}${spacing}${number}` : `${sign}${number}${spacing}${symbol}`;

		return { currency, displayValue };

		function formatNumber(number, decimalCount = 2, thousands = ',', decimal = '.') {
			decimalCount = Math.abs(decimalCount);
			decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

			const negativeSign = number < 0 ? '-' : '';
			const i = parseInt((number = Math.abs(Number(number) || 0).toFixed(decimalCount))).toString();
			const j = i.length > 3 ? i.length % 3 : 0;

			return (
				negativeSign +
				(j ? i.substr(0, j) + thousands : '') +
				i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
				(decimalCount
					? decimal + Math.abs(number - i).toFixed(decimalCount).slice(2)
					: '')
			);
		}
	},
});
</script>
