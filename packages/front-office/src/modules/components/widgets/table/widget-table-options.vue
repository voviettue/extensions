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
					<widget-table-column
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
			:fields="extendFields"
			:initial-values="extendInitialValues"
			primary-key="+"
			style="padding: 0"
			@update:model-value="updateExtendValues($event)"
		/>
	</div>
</template>

<script lang="ts">
import { computed, ref } from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import WidgetTableColumn from './widget-table-column.vue';
import TableColumnCreate from './table-column-create.vue';
import Draggable from 'vuedraggable';

export default {
	components: { Draggable, WidgetTableColumn, TableColumnCreate },
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
		const extendInitialValues = ref({
			strippedRow: false,
			border: true,
			verticalLines: false,
		});

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

		const extendFields = computed(() => {
			const pagination = optionsValues.value?.pagination;
			const extendOptions = [
				{
					field: 'data',
					name: 'Data',
					meta: {
						interface: 'input-multiline',
						width: 'full',
					},
				},
				{
					field: 'strippedRow',
					name: 'Stripped row',
					type: 'boolean',
					meta: {
						width: 'half',
						interface: 'boolean',
					},
				},
				{
					field: 'border',
					name: 'Border',
					type: 'boolean',
					meta: {
						width: 'half',
						interface: 'boolean',
					},
				},
				{
					field: 'verticalLines',
					name: 'Vertical Lines',
					type: 'boolean',
					meta: {
						width: 'half',
						interface: 'boolean',
					},
				},
				{
					field: 'height',
					name: 'Height',
					type: 'string',
					meta: {
						interface: 'input',
						width: 'half',
						options: {
							trim: true,
							placeholder: 'Input value',
						},
					},
				},
				{
					field: 'textAlign',
					name: 'Text Align',
					type: 'string',
					meta: {
						interface: 'select-dropdown',
						width: 'half',
						options: {
							choices: [
								{
									text: 'Left',
									value: 'left',
								},
								{
									text: 'Right',
									value: 'right',
								},
								{
									text: 'Center',
									value: 'center',
								},
								{
									text: 'Justify',
									value: 'justify',
								},
							],
							placeholder: 'Select',
							allowNone: true,
						},
					},
				},
				{
					field: 'textSize',
					name: 'Text Size',
					type: 'string',
					meta: {
						interface: 'select-dropdown',
						width: 'half',
						options: {
							choices: [
								{
									text: 'XS - 0.75rem',
									value: '0.75rem',
								},
								{
									text: 'SM - 0.875rem',
									value: '0.875rem',
								},
								{
									text: 'LG - 1.125rem',
									value: '1.125rem',
								},
								{
									text: 'XL - 1.25rem',
									value: '1.25rem',
								},
								{
									text: '2XL - 1.5rem',
									value: '1.5rem',
								},
								{
									text: '3XL - 1.875rem',
									value: '1.875rem',
								},
							],
							placeholder: 'Select',
							allowNone: true,
						},
					},
				},
				{
					field: 'textStyle',
					name: 'Text Style',
					type: 'json',
					meta: {
						interface: 'select-multiple-dropdown',
						width: 'half',
						options: {
							choices: [
								{
									text: 'Bold',
									value: 'bold',
								},
								{
									text: 'Italic',
									value: 'italic',
								},
								{
									text: 'Underline',
									value: 'underline',
								},
							],
							placeholder: 'Select',
							allowNone: true,
						},
					},
				},
				{
					field: 'borderRadius',
					name: 'Border Radius',
					type: 'string',
					meta: {
						interface: 'input',
						width: 'half',
						options: {
							trim: true,
							placeholder: 'Input value',
						},
					},
				},
				{
					field: 'verticalAlignment',
					name: 'Vertical Alignment',
					type: 'string',
					meta: {
						interface: 'select-dropdown',
						width: 'half',
						options: {
							choices: [
								{
									text: 'Top',
									value: 'top',
								},
								{
									text: 'Middle',
									value: 'middle',
								},
								{
									text: 'Bottom',
									value: 'bottom',
								},
							],
							placeholder: 'Select',
							allowNone: true,
						},
					},
				},
				{
					field: 'shadow',
					name: 'Box Shadow',
					type: 'string',
					meta: {
						interface: 'select-dropdown',
						width: 'half',
						options: {
							choices: [
								{
									text: 'SM',
									value: 'sm',
								},
								{
									text: 'MD',
									value: 'md',
								},
								{
									text: 'LG',
									value: 'lg',
								},
								{
									text: 'XL',
									value: 'xl',
								},
								{
									text: '2XL',
									value: '2xl',
								},
							],
							placeholder: 'Select',
							allowNone: true,
						},
					},
				},
				{
					field: 'pagination',
					name: 'Pagination',
					type: 'boolean',
					meta: {
						interface: 'radio',
						width: 'half',
					},
				},
			];
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
				extendOptions.push(itemPerPageField);
			}
			return extendOptions;
		});

		return {
			close,
			isOpenCreate,
			optionsValues,
			extendFields,
			extendInitialValues,
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
			const data = cloneDeep(optionsValues.value);
			const edits = { ...data, ...values };
			optionsValues.value = edits;
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
