<template>
	<div class="field">
		<div class="type-label">Start Date</div>
		<v-select v-model="startDateFieldWritable" show-deselect :items="dateFields" item-text="name" item-value="field" />
	</div>

	<div class="field">
		<div class="type-label">End Date</div>
		<v-select v-model="endDateFieldWritable" show-deselect :items="dateFields" item-text="name" item-value="field" />
	</div>

	<div class="field">
		<div class="type-label">Group</div>
		<v-select v-model="groupFieldWritable" show-deselect :items="stringFields" item-text="name" item-value="field" />
	</div>

	<div class="field">
		<div class="type-label">Title</div>
		<v-select v-model="titleFieldWritable" show-deselect :items="stringFields" item-text="name" item-value="field" />
	</div>

	<div class="field">
		<div class="type-label">User</div>
		<v-select v-model="userFieldWritable" show-deselect :items="userFields" item-text="name" item-value="field" />
	</div>

	<div class="field">
		<div class="type-label">Tag</div>
		<v-select v-model="tagFieldWritable" show-deselect :items="tagFields" item-text="name" item-value="field" />
	</div>

	<div class="field">
		<div class="type-label">Conditional Styles</div>
		<interface-list
			:value="conditionalStylesWritable"
			:fields="conditionFields"
			template="{{ field }} {{ operator }} {{ value }}"
			@input="conditionalStylesWritable = $event"
		/>
	</div>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { defineComponent, PropType } from 'vue';
import { Field } from '@directus/shared/types';
import { useSync } from '@directus/shared/composables';

export default defineComponent({
	inheritAttrs: false,
	props: {
		collection: {
			type: String,
			required: true,
		},
		dateFields: {
			type: Array as PropType<Field[]>,
			required: true,
		},
		stringFields: {
			type: Array as PropType<Field[]>,
			required: true,
		},
		userFields: {
			type: Array as PropType<Field[]>,
			required: true,
		},
		tagFields: {
			type: Array,
			required: true,
		},
		startDateField: {
			type: String,
			default: null,
		},
		endDateField: {
			type: String,
			default: null,
		},
		groupField: {
			type: String,
			default: null,
		},
		titleField: {
			type: String,
			default: null,
		},
		userField: {
			type: String,
			default: null,
		},
		tagField: {
			type: String,
			default: null,
		},
		conditionalStyles: {
			type: Array,
			default: () => [],
		},
	},
	emits: [
		'update:startDateField',
		'update:endDateField',
		'update:groupField',
		'update:titleField',
		'update:userField',
		'update:tagField',
		'update:conditionalStyles',
	],
	setup(props, { emit }) {
		const { t } = useI18n();

		const startDateFieldWritable = useSync(props, 'startDateField', emit);
		const endDateFieldWritable = useSync(props, 'endDateField', emit);
		const groupFieldWritable = useSync(props, 'groupField', emit);
		const titleFieldWritable = useSync(props, 'titleField', emit);
		const userFieldWritable = useSync(props, 'userField', emit);
		const tagFieldWritable = useSync(props, 'tagField', emit);
		const conditionalStylesWritable = useSync(props, 'conditionalStyles', emit);
		// const conditionalStylesWritable = [];

		const stringOperators = ['eq', 'neq', 'contains', 'starts_with', 'ends_with'];
		const conditionFields = [
			{
				field: 'field',
				type: 'string',
				name: 'Condition Field',
				meta: {
					width: 'full',
					interface: 'select-dropdown',
					options: {
						choices: props.stringFields.map((field) => ({
							text: field.name,
							value: field.field,
						})),
						fields: props.stringFields,
						placeholder: 'Select field',
					},
				},
			},

			{
				field: 'operator',
				name: '$t:operator',
				type: 'string',
				schema: {
					default_value: 'eq',
				},
				meta: {
					interface: 'select-dropdown',
					options: {
						choices: stringOperators.map((operator) => ({
							text: `$t:operators.${operator}`,
							value: operator,
						})),
					},
					width: 'half',
				},
			},
			{
				field: 'value',
				name: '$t:value',
				type: 'string',
				schema: {
					default_value: '',
				},
				meta: {
					interface: 'input',
					width: 'half',
				},
			},
			{
				field: 'color',
				name: '$t:displays.formatted-value.color',
				type: 'string',
				meta: {
					interface: 'select-color',
					width: 'half',
				},
			},
			{
				field: 'background',
				name: '$t:displays.formatted-value.background',
				type: 'string',
				meta: {
					interface: 'select-color',
					width: 'half',
				},
			},
		];

		return {
			t,
			conditionFields,
			startDateFieldWritable,
			endDateFieldWritable,
			groupFieldWritable,
			titleFieldWritable,
			userFieldWritable,
			tagFieldWritable,
			conditionalStylesWritable,
		};
	},
});
</script>
