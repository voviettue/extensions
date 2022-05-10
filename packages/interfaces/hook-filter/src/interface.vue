<template>
	<v-input :model-value="`[FILTER] ${eventName}`" :disabled="true" />
	<v-detail class="group-detail" :label="'View code'">
		<pre><code>{{ code }}</code></pre>
	</v-detail>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		value: {
			type: String,
			default: null,
		},
		disabled: {
			type: Boolean,
			default: null,
		},
		collection: {
			type: String,
			default: null,
		},
		action: {
			type: String,
			default: null,
		},
		code: {
			type: String,
			default: null,
		},
		options: {
			type: Object,
			default: () => {},
		},
	},
	emits: ['input'],
	setup(props, { emit }) {
		return { handleChange };

		function handleChange(value: string): void {
			emit('input', value);
		}
	},
	data() {
		return { eventName: '' };
	},
	created() {
		const filterCollection = this.$attrs['field-data'].meta.options?.collection;
		this.eventName = `${filterCollection}.items.${this.action}`;
	},
});
</script>

<style scoped>
.group-detail {
	margin-top: 10px;
}
.group-detail pre {
	background: #f7fafc;
	padding: 16px;
	border-radius: 2px;
}
</style>
