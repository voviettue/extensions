<template>
	<div class="form">
		<div>
			<v-notice v-if="modelValue?.length === 0">No items</v-notice>
			<draggable
				v-else
				class="list-key-grid"
				:model-value="modelValue"
				:item-key="`key`"
				:force-fallback="true"
				handle=".drag-handle"
				:group="{ name: 'keys' }"
				:animation="150"
				:fallback-on-body="true"
				:invert-swap="true"
				@update:model-value="setSort"
			>
				<template #item="{ element, index }">
					<item-key-display
						:item="element"
						:form-fields="formFields"
						@update="updateKey($event, index)"
						@toggle-visibility="toggleVisibility($event, index)"
						@delete="deleteKey($event, index)"
					/>
				</template>
			</draggable>

			<v-button class="add-new" half-width @click="isOpenCreate = true">Create New Key</v-button>
			<key-create :is-open="isOpenCreate" :form-fields="formFields" @close="close" @create="createKey" />
		</div>
	</div>
</template>

<script lang="ts">
import { computed, ref } from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import ItemKeyDisplay from './item-key-display.vue';
import KeyCreate from './key-create.vue';
import Draggable from 'vuedraggable';

export default {
	components: { Draggable, ItemKeyDisplay, KeyCreate },
	props: {
		value: {
			type: Object,
			default: null,
		},
		formFields: {
			type: Array,
			default: () => [],
		},
	},
	emits: ['input'],
	setup(props, { emit }) {
		const isOpenCreate = ref<boolean>(false);
		const modelValue = computed({
			get() {
				if (props.value === undefined || props.value === null) {
					return [];
				}
				return props.value;
			},
			set(values: any) {
				emit('input', values);
			},
		});

		return {
			close,
			isOpenCreate,
			modelValue,
			setSort,
			createKey,
			updateKey,
			deleteKey,
			toggleVisibility,
		};

		async function setSort(values: any) {
			const data = cloneDeep(modelValue.value);
			const edits = { ...data, columns: values };

			modelValue.value = edits;
		}

		function close() {
			isOpenCreate.value = false;
		}

		function createKey(value: any) {
			const edits = cloneDeep(modelValue.value);
			edits.push(value);

			modelValue.value = edits;
			close();
		}

		function updateKey(value: any, index: number) {
			const edits = cloneDeep(modelValue.value);
			Object.assign(edits[edits?.findIndex((key: any, i: number) => i === index)], value);

			modelValue.value = edits;
		}

		function toggleVisibility(value: any, index: number) {
			const edits = cloneDeep(modelValue.value);
			Object.assign(edits[edits?.findIndex((key: Record<string, any>, i: number) => i === index)], {
				...value,
				hidden: !value.hidden,
			});

			modelValue.value = edits;
		}

		function deleteKey(value: any, index: number) {
			const edits = cloneDeep(modelValue.value);
			edits.splice(index, 1);

			modelValue.value = edits;
		}
	},
};
</script>
<style lang="scss" scoped>
.form {
	display: grid;
	gap: var(--form-vertical-gap) var(--form-horizontal-gap);
}

.list-key-grid {
	position: relative;
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
}

.add-new {
	margin-top: 20px;
	margin-bottom: 20px;
}
</style>
