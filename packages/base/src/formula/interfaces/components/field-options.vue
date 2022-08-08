<template>
	<div>
		<div class="expression-template-option">
			<label>Formula Expression</label>
			<display-expression-template
				:model-value="optionsValues?.template"
				:collection="collection"
				:field="field"
				@update:model-value="updateTemplate($event)"
			/>
		</div>

		<v-form
			:model-value="optionsValues"
			class="extension-options"
			:fields="optionsFields"
			primary-key="+"
			@update:model-value="updateValue($event)"
		/>
	</div>
</template>

<script lang="ts">
import { Field, Relation } from '@directus/shared/types';
import { defineComponent, PropType, computed } from 'vue';
import DisplayExpressionTemplate from './field-expression.vue';
import cloneDeep from 'lodash/cloneDeep';

export default defineComponent({
	components: { DisplayExpressionTemplate },
	props: {
		value: {
			type: Object,
			default: null,
		},
		field: {
			type: Object as PropType<Field>,
			default: null,
		},
		options: {
			type: Object,
			default: null,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		modelValue: {
			type: String,
			default: null,
		},
		nullable: {
			type: Boolean,
			default: true,
		},
		collection: {
			type: String,
			default: null,
		},
		depth: {
			type: Number,
			default: undefined,
		},
		placeholder: {
			type: String,
			default: null,
		},
		inject: {
			type: Object as PropType<{ fields: Field[]; relations: Relation[] }>,
			default: null,
		},
	},
	emits: ['input', 'update:modelValue'],
	setup(props, { emit }) {
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

		const optionsFields = computed(() => {
			const options = [
				{
					field: 'prefix',
					name: 'Prefix',
					type: 'string',
					meta: {
						width: 'half',
						interface: 'input',
						options: {
							trim: false,
						},
					},
				},
				{
					field: 'suffix',
					name: 'Suffix',
					type: 'string',
					meta: {
						width: 'half',
						interface: 'input',
						options: {
							trim: false,
						},
					},
				},
				{
					field: 'iconLeft',
					name: '$t:icon_left',
					type: 'string',
					meta: {
						width: 'half',
						interface: 'select-icon',
					},
				},
				{
					field: 'iconRight',
					name: '$t:icon_right',
					type: 'string',
					meta: {
						width: 'half',
						interface: 'select-icon',
					},
				},
			];

			if (props.field?.type && ['bigInteger', 'integer', 'float', 'decimal'].includes(props.field.type)) {
				const thousandsSeparatorField: any = {
					field: 'thousandsSeparator',
					name: 'Thousands Separator',
					type: 'string',
					meta: {
						width: 'half',
						interface: 'select-dropdown',
						options: {
							choices: [
								{ text: 'Default', value: null },
								{ text: ',', value: ',' },
								{ text: '.', value: '.' },
							],
							allowOther: true,
						},
					},
				};
				const decimalSeparatorField: any = {
					field: 'decimalSeparator',
					name: 'Decimal Separator',
					type: 'string',
					meta: {
						width: 'half',
						interface: 'select-dropdown',
						options: {
							choices: [
								{ text: 'Default', value: null },
								{ text: ',', value: ',' },
								{ text: '.', value: '.' },
							],
							allowOther: true,
						},
					},
				};
				options.push(thousandsSeparatorField);
				options.push(decimalSeparatorField);
			}
			return options;
		});

		return { optionsValues, optionsFields, updateValue, updateTemplate };

		function updateValue(values) {
			const data = cloneDeep(optionsValues.value);
			const edits = { ...data, ...values };
			optionsValues.value = edits;
		}

		function updateTemplate(value) {
			const values = cloneDeep(optionsValues.value);
			values.template = value;
			optionsValues.value = values;
		}
	},
});
</script>

<style scoped>
.expression-template-option {
	margin-bottom: var(--form-vertical-gap);
}
.expression-template-option label {
	margin-bottom: 8px;
	color: var(--foreground-normal-alt);
	font-weight: 600;
	font-size: 16px;
	font-family: var(--family-sans-serif);
	font-style: normal;
	line-height: 19px;
}
</style>
