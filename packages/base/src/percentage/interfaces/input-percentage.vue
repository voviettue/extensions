<template>
	<div>
		<v-input
			class="warning"
			:autofocus="autofocus"
			:model-value="modelValue"
			:placeholder="placeholder"
			:disabled="disabled"
			:trim="true"
			type="number"
			:db-safe="dbSafe"
			:min="min"
			:max="max"
			:step="step"
			@update:model-value="onUpdate"
		>
			<template #append>
				<v-icon :name="!isValid ? 'error' : 'percent'" :class="!isValid ? 'danger' : ''" />
			</template>
		</v-input>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { round } from 'lodash';

export default defineComponent({
	props: {
		value: {
			type: [String, Number],
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
		min: {
			type: Number,
			default: 0,
		},
		max: {
			type: Number,
			default: 100,
		},
		step: {
			type: Number,
			default: 1,
		},
	},
	emits: ['input'],
	setup(props, { emit }) {
		const isValid = ref<boolean>(true);
		const modelValue = ref<string | number>(null);

		watch(
			() => props.value,
			(value: string) => {
				modelValue.value = value ? round(parseFloat(value) * 100, 2) : value;
			},
			{ immediate: true }
		);

		return { isValid, modelValue, onUpdate };

		function onUpdate(value) {
			if (value >= props.min && value <= props.max) {
				isValid.value = true;
				emit('input', value / 100);
			} else {
				isValid.value = false;
				emit('input', null);
			}
		}
	},
});
</script>

<style scoped>
:deep(.danger i) {
	color: var(--danger);
}
</style>
