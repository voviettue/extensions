<template>
	<div>
		<v-form
			:model-value="optionsValues"
			class="extension-options"
			:fields="optionsFields"
			primary-key="+"
			@update:model-value="optionsValues = $event"
		/>
	</div>
</template>

<script lang="ts">
import { Field, Relation } from '@directus/shared/types';
import { defineComponent, PropType, computed, inject, watch } from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import { useRelation } from '../composables/use-relation';

export default defineComponent({
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
		// eslint-disable-next-line vue/no-mutating-props
		props.field.meta.special = ['alias', 'no-data'];

		const optionsValues = computed({
			get() {
				return props.value ?? {};
			},
			set(values: any) {
				emit('input', values);
			},
		});

		const stores: any = inject('stores');
		const fieldsStore = stores.useFieldsStore();

		watch(
			() => optionsValues.value?.lookupField,
			() => {
				optionsValues.value = { ...optionsValues.value, viewFields: null, filter: null };
			}
		);

		const optionsFields = computed(() => {
			const relationInfo = useRelation(props.collection, optionsValues.value?.lookupField, stores);
			const lookupCollection = relationInfo?.relatedCollection?.collection;

			const choices = getFieldTree(props.collection, 2);

			return [
				{
					field: 'lookupField',
					type: 'string',
					name: 'Lookup Field',
					meta: {
						width: 'full',
						interface: 'select-dropdown',
						options: {
							choices: choices,
							placeholder: 'Select related field',
							allowNone: false,
						},
					},
				},
				{
					field: 'viewFields',
					type: 'string',
					name: 'Fields',
					meta: {
						width: 'full',
						interface: 'system-fields',
						options: {
							collectionName: lookupCollection,
							placeholder: 'Select review fields',
						},
					},
				},

				{
					field: 'filter',
					type: 'json',
					name: 'Filter',
					meta: {
						interface: 'system-filter',
						options: {
							collectionName: lookupCollection,
						},
					},
				},
			];
		});

		return {
			optionsValues,
			optionsFields,
			updateValue,
			updateLookupField,
		};

		function getFieldTree(collection, level = 0, parentValue = null) {
			let choices = [];
			if (!collection) return choices;
			const fields = fieldsStore.getFieldsForCollection(collection);
			choices = fields
				.filter((e) => e?.group !== true)
				.map((e) => {
					const value = parentValue ? `${parentValue}.${e.field}` : e.field;
					return {
						disabled: !e?.meta?.special?.includes('o2m') && !e?.meta?.special?.includes('m2m'),
						text: `${e.name} (${value})`,
						value: value,
						children:
							level > 1 && e?.schema?.foreign_key_table
								? getFieldTree(e?.schema?.foreign_key_table, level - 1, e.field)
								: null,
					};
				});

			return choices;
		}

		function updateValue(values) {
			const data = cloneDeep(optionsValues.value);
			const edits = { ...data, ...values };
			optionsValues.value = edits;
		}

		function updateLookupField(value) {
			const values = cloneDeep(optionsValues.value);
			values.lookupField = value;
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
