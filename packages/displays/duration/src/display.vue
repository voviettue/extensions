<template>
	<span>{{ displayValue }}</span>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';

export default defineComponent({
	props: {
		value: {
			type: String,
			default: null,
		},
		includeSeconds: {
			type: Boolean,
			default: false,
		},
	},
	setup(props) {
		const displayValue = ref<string | null>(null);

		const localValue = computed(() => {
			return props.value;
		});
		watch(
			localValue,
			async (newValue) => {
				displayValue.value = props.includeSeconds ? props.value : props.value.slice(0, -3);
			},
			{ immediate: true }
		);

		return { displayValue };
	},
});
</script>
