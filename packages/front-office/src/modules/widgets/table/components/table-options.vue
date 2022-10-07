<template>
	<div class="form">
		<div>
			<div class="field-label type-label">
				<span class="field-name"><v-text-overflow text="Columns" /></span>
			</div>
			<v-notice v-if="optionsValues.columns === undefined || optionsValues.columns?.length === 0">No items</v-notice>
			<draggable
				v-else
				class="table-column-grid"
				:model-value="optionsValues.columns"
				:item-key="`key`"
				:force-fallback="true"
				handle=".drag-handle"
				:group="{ name: 'table-columns' }"
				:animation="150"
				:fallback-on-body="true"
				:invert-swap="true"
				@update:model-value="setSort"
			>
				<template #item="{ element, index }">
					<table-column
						:column="element"
						@update="updateColumn($event, index)"
						@toggle-visibility="toggleVisibility($event, index)"
						@duplicate="duplicateColumn($event, index)"
						@delete="deleteColumn($event, index)"
					/>
				</template>
			</draggable>

			<v-button class="add-new" half-width @click="isOpenCreate = true">Create New Column</v-button>
			<table-column-create :is-open="isOpenCreate" @close="close" @create="createColumn" />
		</div>
		<v-form
			:model-value="optionsValues"
			class="extension-options"
			:fields="formFields"
			primary-key="+"
			style="padding: 0"
			@update:model-value="updateExtendValues($event)"
		/>
	</div>
</template>

<script lang="ts">
import { computed, ref } from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import TableColumn from './table-column.vue';
import TableColumnCreate from './table-column-create.vue';
import optionsFields from '../config/table-options-fields';
import Draggable from 'vuedraggable';

export default {
	components: { Draggable, TableColumn, TableColumnCreate },
	props: {
		value: {
			type: Object,
			default: null,
		},
		modelValue: {
			type: String,
			default: null,
		},
	},
	emits: ['input', 'update:modelValue'],
	setup(props, { emit }) {
		const isOpenCreate = ref<boolean>(false);
		const optionsValues = computed({
			get() {
				if (props.value === undefined || props.value === null) {
					return {};
				}
				return props.value;
			},
			set(values: any) {
				emit('input', values);
			},
		});

		const formFields = computed(() => {
			const pagination = optionsValues.value?.pagination;
			const options = [...optionsFields!];
			if (pagination === true) {
				const itemPerPageField = {
					field: 'itemPerPage',
					name: 'Item Per Page',
					type: 'integer',
					meta: {
						interface: 'select-dropdown',
						width: 'half',
						options: {
							choices: [
								{
									text: '10',
									value: 10,
								},
								{
									text: '20',
									value: 20,
								},
								{
									text: '50',
									value: 50,
								},
								{
									text: '100',
									value: 100,
								},
								{
									text: '200',
									value: 200,
								},
							],
							placeholder: '10',
							allowOther: true,
							allowNone: true,
						},
					},
				};
				const paginationIndex = options.findIndex((option: any) => option.field === 'pagination');
				options.splice(paginationIndex + 1, 0, itemPerPageField);
			}
			return options;
		});

		return {
			close,
			isOpenCreate,
			optionsValues,
			formFields,
			updateExtendValues,
			setSort,
			createColumn,
			updateColumn,
			toggleVisibility,
			deleteColumn,
		};

		async function setSort(values: any) {
			const data = cloneDeep(optionsValues.value);
			const edits = { ...data, columns: values };
			optionsValues.value = edits;
		}

		function updateExtendValues(values: any) {
			optionsValues.value = cloneDeep(values);
		}

		function close() {
			isOpenCreate.value = false;
		}

		function createColumn(value: any) {
			const data = cloneDeep(optionsValues.value);
			const columnData = data.columns ?? [];
			columnData.push(value);

			const edits = { ...data, columns: columnData };
			optionsValues.value = edits;

			close();
		}

		function updateColumn(value: any, index: number) {
			const data = cloneDeep(optionsValues.value);
			const columnData = data.columns ?? [];
			Object.assign(columnData[columnData.findIndex((col: Record<string, any>, i: number) => i === index)], value);

			const edits = { ...data, columns: columnData };
			optionsValues.value = edits;
		}

		function toggleVisibility(value: any, index: number) {
			const data = cloneDeep(optionsValues.value);
			const columnData = data.columns ?? [];
			Object.assign(columnData[columnData.findIndex((col: Record<string, any>, i: number) => i === index)], {
				...value,
				hidden: !value.hidden,
			});

			const edits = { ...data, columns: columnData };
			optionsValues.value = edits;
		}

		function deleteColumn(value: any, index: number) {
			const data = cloneDeep(optionsValues.value);
			const columnData = data.columns ?? [];
			columnData.splice(index, 1);
			const edits = { ...data, columns: columnData };
			optionsValues.value = edits;
		}
	},
};
</script>
<style lang="scss" scoped>
.form {
	display: grid;
	gap: var(--form-vertical-gap) var(--form-horizontal-gap);
}

.table-column-grid {
	position: relative;
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
}

.add-new {
	margin-top: 20px;
	margin-bottom: 20px;
}
</style>
