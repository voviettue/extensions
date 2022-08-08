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
import has from 'lodash/has';
import round from 'lodash/round';
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
				const value = await getValue();
				emitValue(value);
			} catch {
				emitValue(null);
			} finally {
				loading.value = false;
			}
		}

		async function getValue() {
			let value = null;
			const path = props.relationField + '.' + props.lookupField;
			const keys = path.split('.');
			const findKeys = [];

			try {
				for (let i = 0; i < keys.length; i++) {
					if (has(values.value, keys.slice(0, i + 1))) {
						findKeys.push(keys[i]);
						value = get(values.value, findKeys);
						continue;
					}
					break;
				}

				if (findKeys.length === keys.length) return value;

				const field = fieldsStore.getField(props.collection, findKeys.join('.'));
				const collection = field?.schema?.foreign_key_table;
				const pk = field?.schema?.foreign_key_column;
				const id = value instanceof Object ? value?.[pk] : value;
				const fields = keys.slice(findKeys.length).join('.');
				let item = await getItem(collection, id, fields);
				if (value instanceof Object) {
					item = { ...item, ...value };
				}
				return get(item, fields);
			} catch {
				return null;
			}
		}

		async function getItem(collection, id, fields) {
			if (!id) return {};

			try {
				const url =
					collection.startsWith('directus_') === true
						? collection.replace('directus_', '') + `/${id}`
						: `items/${collection}/${id}`;
				const res = await api.get(url, {
					params: { fields },
				});
				return res?.data?.data || {};
			} catch {
				return {};
			}
		}

		function cast(value: any) {
			if (value === null || value === undefined || value === '' || value === {} || value === []) return undefined;

			switch (schemaField?.type) {
				case 'decimal':
				case 'float':
					return value == 0 ? 0 : round(value, schemaField?.schema?.numeric_scale) || null;

				case 'int':
				case 'bigInteger':
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
