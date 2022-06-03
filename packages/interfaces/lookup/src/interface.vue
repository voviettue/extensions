<template>
	<div class="interface">
		<v-skeleton-loader v-if="loading" />

		<v-notice v-if="!schemaLookupField || !relationField || !schemaLookupField" type="warning">
			<template v-if="!relationField || !schemaLookupField">
				{{ `Invalid interface options.` }}
			</template>
			<template v-else>
				{{ `Interface "${schemaLookupField?.meta?.interface}" not found.` }}
			</template>
		</v-notice>

		<component
			:is="
				schemaLookupField.meta?.interface
					? `interface-${schemaLookupField.meta.interface}`
					: `interface-${getDefaultInterfaceForType(schemaLookupField.type)}`
			"
			v-else
			v-bind="schemaLookupField.meta?.options || {}"
			:width="schemaLookupField.meta?.width || 'full'"
			:type="schemaLookupField.type"
			:collection="schemaLookupField.collection"
			:field="schemaLookupField.field"
			:field-data="schemaLookupField"
			:placeholder="''"
			:value="localValue"
			:loading="loading"
			disabled
			@update:model-value="emitValue"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, inject, computed } from 'vue';
import { useApi, useStores } from '@directus/extensions-sdk';
import get from 'lodash/get';
import round from 'lodash/round';
import cloneDeep from 'lodash/cloneDeep';
import { getDefaultInterfaceForType } from './composables/get-default-interface-for-type';

export default defineComponent({
	props: {
		value: {
			type: [String, Number],
			default: null,
		},
		relationField: {
			type: String,
			required: true,
		},
		lookupField: {
			type: String,
			required: true,
		},
		collection: {
			type: String,
			required: true,
		},
		field: {
			type: String,
			required: true,
		},
		disabled: {
			type: Boolean,
			default: true,
		},
	},
	emits: ['input'],
	setup(props, { emit }) {
		const localValue = ref<string | number | object>(props.value);
		const loading = ref<boolean>(false);

		const api = useApi();
		const { useFieldsStore, useRelationsStore } = useStores();
		const fieldsStore = useFieldsStore();
		const relationsStore = useRelationsStore();
		const values = inject('values', ref<Record<string, any>>({}));

		const relatedCollection = relationsStore
			.getRelationsForCollection(props.collection)
			.find((relation: any) => relation?.field === props.relationField)?.related_collection;

		const schemaField = fieldsStore.getField(props.collection, props.field);

		const schemaLookupField = computed(() => {
			const field = cloneDeep(fieldsStore.getField(relatedCollection, props.lookupField));
			if (field) {
				switch (schemaField?.meta?.interface) {
					case 'input-formula':
						field.meta.interface = 'input';
						break;
				}
			}
			return field;
		});

		watch(
			() => values.value?.[props.relationField],
			async () => {
				await lookup();
			}
		);

		return {
			emitValue,
			loading,
			localValue,
			schemaLookupField,
			getDefaultInterfaceForType,
		};

		function emitValue(value: any): void {
			localValue.value = cast(value);
			emit('input', localValue.value);
		}

		async function lookup() {
			const value = values.value?.[props.relationField];

			if (!value || !relatedCollection || !schemaLookupField.value) {
				emitValue(null);
				return;
			}

			loading.value = true;
			try {
				const id = values.value?.[props.relationField];
				const url =
					relatedCollection.startsWith('directus_') === true
						? relatedCollection.replace('directus_', '') + `/${id}`
						: `items/${relatedCollection}/${id}`;
				const fields = props.lookupField;

				const res = await api.get(url, {
					params: { fields },
				});
				const item = res?.data?.data;
				const result = get(item, props.lookupField);

				emitValue(result);
			} catch {
				emitValue(null);
			} finally {
				loading.value = false;
			}
		}

		function cast(value: any) {
			if (value === null || value === undefined || value === '' || value === {} || value === []) return undefined;

			const schema = schemaField.schema;

			switch (schema.data_type) {
				case 'decimal':
				case 'float':
					return value == 0 ? 0 : round(value, schema.numeric_scale) || undefined;

				case 'int':
				case 'bigint':
					return value == 0 ? 0 : round(value) || undefined;

				case 'json':
				case 'csv':
					return Array.isArray(value) ? value : undefined;

				case 'boolean':
					if (['true', '1'].includes(String(value).toLowerCase())) {
						return true;
					} else if (['false', '0'].includes(String(value).toLowerCase())) {
						return false;
					} else {
						return undefined;
					}

				case 'string':
				case 'text':
				case 'varchar':
				case 'char':
					return value.toString().substring(0, schema.max_length || undefined);

				default:
					return value;
			}
		}
	},
});
</script>
<style scoped>
.interface {
	position: relative;
}

.v-skeleton-loader {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 2;
	width: 100%;
	height: 100%;
}
</style>
