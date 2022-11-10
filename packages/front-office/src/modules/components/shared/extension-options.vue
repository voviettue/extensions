<template>
	<v-notice v-if="useComponent === false && optionsFields.length === 0">No options available</v-notice>

	<v-form
		v-else-if="useComponent === false"
		v-model="optionsValues"
		class="extension-options"
		:fields="optionsFields"
		:initial-values="disabled ? optionsValues : null"
		:disabled="disabled"
		:raw-editor-enabled="false"
		:nested="true"
		primary-key="+"
	/>

	<component
		:is="optionsFields"
		v-else
		:collection="collection"
		:value="optionsValues"
		@input="optionsValues = $event"
	/>
</template>

<script setup lang="ts">
import { ExtensionOptions } from '../../types/extensions';
import { computed, defineEmits } from 'vue';

type Props = {
	collection: string;
	optionsFields: ExtensionOptions;
	modelValue: Record<any, string>;
	disabled?: boolean;
};
const props = withDefaults(defineProps<Props>(), {
	disabled: false,
});

const emit = defineEmits(['update:modelValue']);

const optionsValues = computed({
	get() {
		return props.modelValue;
	},
	set(values: Record<string, any>) {
		emit('update:modelValue', values);
	},
});

const useComponent = computed(() => {
	return (
		typeof props.optionsFields !== 'function' &&
		Array.isArray(props.optionsFields) === false &&
		props.optionsFields !== null
	);
});
</script>
<style lang="scss" scoped>
.extension-options {
	--form-vertical-gap: 2rem;
	--form-horizontal-gap: 32px;

	:deep(.add-margin-top) {
		margin-top: 1rem !important;
	}
}
</style>
