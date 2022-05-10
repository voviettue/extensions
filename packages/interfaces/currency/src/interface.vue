<template>
	<v-menu attached :disabled="disabled">
		<template #activator="{ active, activate }">
			<v-input
				v-model="searchQuery"
				:disabled="disabled"
				:placeholder="value || 'Select the currency'"
				:class="{ 'has-value': value }"
				:nullable="false"
				@focus="activate"
			>
				<template #append>
					<v-icon v-if="value !== null" clickable name="close" @click="emitValue(null)" />
					<v-icon
						v-else
						clickable
						name="expand_more"
						class="open-indicator"
						:class="{ open: active }"
						@click="activate"
					/>
				</template>
			</v-input>
		</template>

		<v-list v-if="filteredCurrencies.length > 0">
			<v-list-item
				v-for="currency of filteredCurrencies"
				:key="currency.code"
				clickable
				@click="() => emitValue(currency.code)"
			>
				<v-list-item-content>{{ `${currency.name} - ${currency.code} (${currency.symbol})` }}</v-list-item-content>
			</v-list-item>
		</v-list>
	</v-menu>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue';
import currencies from './currencies.json';

export default defineComponent({
	props: {
		value: {
			type: String,
			default: null,
		},
		placeholder: {
			type: String,
			default: null,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		preferred: {
			type: Array as PropType<Record<string, any>[]>,
			default: () => [],
		},
	},
	emits: ['input'],
	setup(props, { emit }) {
		const searchQuery = ref('');
		const preferredCurrencies =
			props.preferred?.length > 0 ? currencies.filter((el: any) => props.preferred.indexOf(el.code) > -1) : currencies;

		const filteredCurrencies = computed(() => {
			if (searchQuery.value.length === 0) {
				return preferredCurrencies;
			} else {
				const searchValue = searchQuery.value.toLowerCase();
				return preferredCurrencies.filter(
					(el: any) => el.name.toLowerCase().includes(searchValue) || el.code.toLowerCase().includes(searchValue)
				);
			}
		});

		return { currencies, filteredCurrencies, emitValue, searchQuery };

		function emitValue(value: string) {
			searchQuery.value = '';
			emit('input', value);
		}
	},
});
</script>

<style lang="scss" scoped>
.v-input.has-value {
	--v-input-placeholder-color: var(--foreground-normal);

	&:focus-within {
		--v-input-placeholder-color: var(--foreground-subdued);
	}
}

.open-indicator {
	transform: scaleY(1);
	transition: transform var(--fast) var(--transition);
}

.open-indicator.open {
	transform: scaleY(-1);
}
</style>
