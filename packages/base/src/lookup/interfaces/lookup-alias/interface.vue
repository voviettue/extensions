<template>
	<div class="interface">
		<v-notice v-if="!schemaField" type="warning">
			{{ `Invalid interface options.` }}
		</v-notice>

		<template v-else>
			<InputAliasLookup v-if="isAliasField" v-bind="props" />
			<component :is="'interface-input-lookup'" v-else v-bind="lookupProps" />
		</template>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import InputAliasLookup from './input-alias-lookup.vue';
import { Filter } from '@directus/shared/types';
import { useStores } from '@directus/extensions-sdk';

export default defineComponent({
	components: { InputAliasLookup },
	props: {
		value: {
			type: String,
			default: null,
		},
		collection: {
			type: String,
			required: true,
		},
		field: {
			type: String,
			required: true,
		},
		lookupField: {
			type: String,
			required: true,
		},
		viewFields: {
			type: Array,
			default: () => [],
		},
		filter: {
			type: Object as PropType<Filter>,
			default: () => null,
		},
	},
	setup(props) {
		const { useFieldsStore } = useStores();
		const fieldsStore = useFieldsStore();
		const schemaField: any = fieldsStore.getField(props.collection, props.lookupField ?? '');

		const lookupProps = computed(() => {
			const fieldKeys = props.lookupField.split('.');
			return {
				collection: props.collection,
				relationField: fieldKeys.shift(),
				lookupField: fieldKeys.join('.'),
				field: props.field,
				disabled: true,
			};
		});

		const isAliasField =
			schemaField && (schemaField.meta.special?.includes('m2m') || schemaField.meta.special?.includes('o2m'));

		return { schemaField, props, lookupProps, isAliasField };
	},
});
</script>
