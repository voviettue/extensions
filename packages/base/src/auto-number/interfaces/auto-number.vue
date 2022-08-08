<template>
	<v-input :disabled="true" :readonly="true" :model-value="props.value">
		<template v-if="iconLeft" #prepend><v-icon :name="props.iconLeft" /></template>
		<template v-if="iconRight" #append><v-icon :name="props.iconRight" /></template>
	</v-input>
</template>

<script lang="ts" setup>
interface Props {
	value?: string;
	iconLeft?: string;
	iconRight?: string;
	prefix?: string;
	startNumber?: number;
	minNumberOfDigits?: number;
	currentNumber?: number;
	disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	value: undefined,
	iconLeft: undefined,
	iconRight: undefined,
	prefix: undefined,
	startNumber: 1,
	minNumberOfDigits: 1,
	currentNumber: 1,
	disabled: true,
});
</script>
