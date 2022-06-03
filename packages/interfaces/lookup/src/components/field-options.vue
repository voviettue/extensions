<template>
	<div>
		<v-form
			:model-value="optionsValues"
			class="extension-options"
			:fields="optionsFields"
			primary-key="+"
			@update:modelValue="optionsValues = $event"
		/>
	</div>
</template>

<script lang="ts">
import { Field, Relation } from "@directus/shared/types";
import { defineComponent, PropType, computed, inject, watch } from "vue";
import cloneDeep from "lodash/cloneDeep";
import formatTitle from "@directus/format-title";

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
	emits: ["input", "update:modelValue"],
	setup(props, { emit }) {
		const optionsValues = computed({
			get() {
				return props.value ?? {};
			},
			set(values: any) {
				emit("input", values);
			},
		});

		const stores: any = inject("stores");
		const relationsStore = stores.useRelationsStore();
		const fieldsStore = stores.useFieldsStore();
		const fields = fieldsStore.getFieldsForCollection(props.collection);
		const relatedCollections = relationsStore
			.getRelationsForCollection(props.collection)
			.filter(
				(relation: any) =>
					relation?.meta?.junction_field === null &&
					relation?.related_collection != props.collection
			);

		const relatedCollectionOptions = relatedCollections.map((el: any) => {
			const collectionName =
				el.related_collection == props.collection
					? el.collection
					: el.related_collection;
			const relationField =
				el.related_collection == props.collection
					? el.meta?.one_field
					: el.field;

			const text = `${formatTitle(
				collectionName.replace("directus_", "system_")
			)} (${relationField})`;
			const value = `${relationField}`;

			return { text, value };
		});

		const relationCollection = computed(() => {
			const field = fields.find(
				(e: any) => e.field === optionsValues.value?.relationField
			);
			return field?.schema?.foreign_key_table ?? null;
		});

		watch(
			() => relationCollection.value,
			() => {
				optionsValues.value.lookupField = null;
			}
		);

		const optionsFields = computed(() => {
			const field = fields.find(
				(e: any) => e.field === optionsValues.value?.relationField
			);
			const relationCollection = field?.schema?.foreign_key_table;
			const choices = getFieldTree(relationCollection, 2);

			return [
				{
					field: "relationField",
					type: "string",
					name: "Related Collection",
					meta: {
						width: "half",
						interface: "select-dropdown",
						options: {
							choices: relatedCollectionOptions,
							placeholder: "Select related collection",
							allowNone: false,
						},
					},
				},
				{
					field: "lookupField",
					type: "string",
					name: "Lookup Field",
					meta: {
						width: "half",
						interface: "select-dropdown",
						options: {
							choices: choices,
							placeholder: "Select related collection",
							allowNone: false,
						},
					},
				},
			];
		});

		return {
			optionsValues,
			relationCollection,
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
						disabled: e?.type === "alias" || e.type !== props.field.type,
						text: `${e.name} (${value})`,
						value: value,
						children: level > 1 && e?.schema?.foreign_key_table
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
