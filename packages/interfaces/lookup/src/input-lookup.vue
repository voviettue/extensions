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
			:primary-key="relationId"
			:placeholder="''"
			:value="localValue"
			:loading="loading"
			:disabled="manualUpdate === false || schemaField?.type === 'alias'"
			@input="emitValue($event)"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, inject, computed } from 'vue';
import { useApi, useStores } from '@directus/extensions-sdk';
import get from 'lodash/get';
import round from 'lodash/round';
import isNil from 'lodash/isNil';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import { getDefaultInterfaceForType } from './composables/get-default-interface-for-type';

export default defineComponent({
	props: {
		value: {
			type: [String, Number, Array],
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
		disabled: {
			type: Boolean,
			default: true,
		},
		relationField: {
			type: String,
			required: true,
		},
		lookupField: {
			type: String,
			required: true,
		},
		triggerOnCreate: {
			type: Boolean,
			default: () => true,
		},
		triggerOnUpdate: {
			type: Boolean,
			default: () => true,
		},
		manualUpdate: {
			type: Boolean,
			default: () => false,
		},
	},
	emits: ['input'],
	setup(props, { emit, attrs }) {
		const api = useApi();
		const { useFieldsStore, useRelationsStore } = useStores();
		const fieldsStore = useFieldsStore();
		const relationsStore = useRelationsStore();
		const values = inject('values', ref<Record<string, any>>({}));

		const lookupFields = fieldsStore
			.getFieldsForCollection(props.collection)
			.filter((e) => e?.meta?.interface === 'input-lookup')
			.map((e) => e.field);

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

		const relationValue = computed(() => {
			return values.value?.[props.relationField];
		});

		const relationId = computed(() => {
			const relationPK = fieldsStore.getPrimaryKeyFieldForCollection(relatedCollection)?.field;
			return relationValue.value instanceof Object ? get(relationValue.value, relationPK) : relationValue.value;
		});

		const loading = ref<boolean>(false);
		const isEdit = attrs?.['primary-key'] !== '+' ? true : false;
		const localValue = ref(undefined);
		localValue.value = cast(props.value);

		watch(
			() => props.value,
			() => {
				localValue.value = cast(props.value);
			}
		);

		watch(
			() => values?.value,
			(newValue, oldValue) => {
				if (isEdit && Object.keys(oldValue).length === 0) return;
				if (!isEqual(newValue?.[props.relationField], oldValue?.[props.relationField])) {
					const index = lookupFields.indexOf(props.field);
					// run each field after 20ms to prevent form values only updated 1 field.
					setTimeout(() => lookup(), index * 20);
				}
			}
		);

		return {
			emitValue,
			loading,
			localValue,
			relatedCollection,
			relationValue,
			relationId,
			schemaField,
			schemaLookupField,
			getDefaultInterfaceForType,
		};

		function emitValue(value: any): void {
			localValue.value = cast(value);
			if (schemaField?.type === 'alias') return;
			values.value[props.field] = localValue.value;
			emit('input', localValue.value);
		}

		async function lookup() {
			if (!relatedCollection || !schemaLookupField.value) return;
			if (!isEdit && props.triggerOnCreate === false) return;
			if (isEdit && props.triggerOnUpdate === false) return;

			loading.value = true;
			try {
				let item = await getItem();
				if (relationValue.value instanceof Object) {
					item = { ...item, ...relationValue.value };
				}
				const result = get(item, props.lookupField);
				emitValue(result);
			} catch {
				emitValue(null);
			} finally {
				loading.value = false;
			}
		}

		async function getItem() {
			const id = relationId.value;
			if (!id) return {};

			try {
				const url =
					relatedCollection.startsWith('directus_') === true
						? relatedCollection.replace('directus_', '') + `/${id}`
						: `items/${relatedCollection}/${id}`;
				const fields = props.lookupField;
				const res = await api.get(url, {
					params: { fields },
				});
				return res?.data?.data || {};
			} catch {
				return {};
			}
		}

		function cast(value: any) {
			// if (value === null || value === '' || value === {} || value === []) return undefined;

			switch (schemaField?.type) {
				case 'decimal':
				case 'float':
					if (isNil(value)) return null;
					return value == 0 ? 0 : round(value, schemaField?.schema?.numeric_scale) || null;

				case 'int':
				case 'bigInteger':
					if (isNil(value)) return null;
					return value == 0 ? 0 : round(value) || null;

				case 'json':
				case 'csv':
				case 'alias':
					return Array.isArray(value) ? value : [];

				case 'boolean':
					if (['true', '1'].includes(String(value).toLowerCase())) {
						return true;
					} else if (['false', '0'].includes(String(value).toLowerCase())) {
						return false;
					} else {
						return null;
					}

				case 'string':
				case 'text':
					if (isNil(value)) return null;
					return String(value).substring(0, schemaField?.schema.max_length || null);

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
