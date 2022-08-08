<template>
	<span>{{ displayValue }}%</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { round } from 'lodash';

export default defineComponent({
	props: {
		value: {
			type: [String, Number],
			default: null,
		},
		type: {
			type: String,
			required: true,
		},
	},
	setup(props) {
		let displayValue = String(props.value);

		if (['float', 'decimal'].includes(props.type)) {
			displayValue = round(parseFloat(displayValue) * 100, 2);
		} else {
			displayValue = round(parseInt(displayValue) * 100, 2);
		}

		return { displayValue };
	},
});
</script>
