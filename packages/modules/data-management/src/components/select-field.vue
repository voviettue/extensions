<template>
	<v-menu placement="bottom-start">
		<template #activator="{ toggle, active }">
			<button class="name" @click="toggle">
				<span v-tooltip="selectedField">{{ field ? field.name : 'Unmapped field' }}</span>
				<v-icon :name="active ? 'expand_less' : 'expand_more'" />
			</button>
		</template>
		<v-field-list :collection="props.collection" :disabled-fields="disabledFields" @select-field="onSelectField">
			<template #prepend>
				<v-list-item class="link clickable" @click="() => onSelectField(null)">
					<v-list-item-content>Unmapped field</v-list-item-content>
				</v-list-item>
			</template>
		</v-field-list>
	</v-menu>
</template>

<script lang="ts" setup>
import { computed, ref, inject } from 'vue';

interface Props {
	collection: string;
	field?: string;
	disabledFields?: string[];
}
const props = withDefaults(defineProps<Props>(), {
	field: undefined,
	disabledFields: () => [],
});
const emit = defineEmits(['select-field']);
const selectedField = ref<string | null>(props.field || '');
const stores = inject<any>('stores');
const { getField } = stores.useFieldsStore();
const field = computed(() => {
	return selectedField.value === null ? null : getField(props.collection, selectedField.value);
});

const onSelectField = (value: string | null) => {
	selectedField.value = value;
	emit('select-field', value);
};
</script>
