<template>
	<div class="system-display-template">
		<v-notice v-if="fields.length === 0" type="info">No data to select</v-notice>

		<v-field-template
			v-else
			collection=""
			:model-value="value"
			:disabled="disabled"
			:inject="{ fields }"
			@update:model-value="$emit('input', $event)"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		disabled: {
			type: Boolean,
			default: false,
		},
		value: {
			type: String,
			default: null,
		},
		fields: {
			type: Array,
			default: () => [],
		},
	},
	emits: ['input'],
	setup() {
		return {};
	},
});
</script>
