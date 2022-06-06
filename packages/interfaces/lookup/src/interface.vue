<template>
	<div class="interface">
		<v-skeleton-loader v-if="loading" />

		<v-notice v-if="!lookupFieldObj || !relationField || !lookupField" type="warning">
			<template v-if="!relationField || !lookupField">
				{{ `Invalid interface options.` }}
			</template>
			<template v-else>
				{{ `Interface "${lookupFieldObj?.meta?.interface}" not found.` }}
			</template>
		</v-notice>

		<component
			v-else
			:is="
				lookupFieldObj.meta?.interface
					? `interface-${lookupFieldObj.meta.interface}`
					: `interface-${getDefaultInterfaceForType(lookupFieldObj.type)}`
			"
			v-bind="lookupFieldObj.meta?.options || {}"
			:width="lookupFieldObj.meta?.width || 'full'"
			:type="lookupFieldObj.type"
			:collection="lookupFieldObj.collection"
			:field="lookupFieldObj.field"
			:field-data="lookupFieldObj"
			:value="localValue === undefined ? lookupFieldObj.schema?.default_value : localValue"
			:loading="loading"
			disabled
			@update:model-value="emitValue"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, inject } from 'vue';
import { useApi, useStores } from '@directus/extensions-sdk';
import { isEqual, round, cloneDeep } from 'lodash';
import { getDefaultInterfaceForType } from './get-default-interface-for-type';

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

		const currentFieldObj = fieldsStore
			.getFieldsForCollection(props.collection)
			.find((e: any) => e.field === props.field);

		const relatedCollection = relationsStore
			.getRelationsForCollection(props.collection)
			.find((relation: any) => relation?.field == props.relationField)?.related_collection;

		const relatedCollectionPK = fieldsStore.getPrimaryKeyFieldForCollection(relatedCollection)?.field;

		const lookupField = fieldsStore
			.getFieldsForCollection(relatedCollection)
			.filter((e: any) => e?.type !== 'alias')
			.find((e: any) => e.field === props.lookupField);

		const lookupFieldObj = cloneDeep(lookupField);

		console.log({
			fields: relationsStore.getRelationsForCollection(props.collection),
		});

		watch(
			() => cloneDeep(values.value[props.relationField]),
			async (newValue, oldValue) => {
				if (newValue == null && oldValue == null) return;

				if (!isEqual(newValue, oldValue)) {
					await lookupItems(newValue);
				}
			}
		);

		return {
			emitValue,
			loading,
			localValue,
			lookupFieldObj,
			getDefaultInterfaceForType,
		};

		function emitValue(value: any): void {
			localValue.value = cast(value);

			switch (lookupFieldObj?.meta?.interface) {
				case 'list':
				case 'select-multiple-checkbox':
				case 'select-multiple-checkbox-tree':
				case 'select-multiple-dropdown':
				case 'tags':
					localValue.value = value ? JSON.parse(value) : undefined;
					break;

				case 'input-formula':
					lookupFieldObj.meta.interface = 'input';
					break;
			}

			emit('input', localValue.value);
		}

		function buildFilter(item: any) {
			if (!item) return null;

			if (item.hasOwnProperty(relatedCollectionPK)) {
				return { [relatedCollectionPK]: { _eq: item[relatedCollectionPK] } };
			} else {
				if (['number', 'string'].includes(typeof item)) {
					return { [relatedCollectionPK]: { _eq: item } };
				} else {
					return null;
				}
			}
		}

		async function lookupItems(items: any) {
			loading.value = true;

			try {
				let itemValues = [];

				const url =
					relatedCollection.startsWith('directus_') === true
						? relatedCollection.replace('directus_', '')
						: `items/${relatedCollection}`;
				const filter = buildFilter(items);
				const fields = `${relatedCollectionPK},${props.lookupField}`;

				if (relatedCollection && filter) {
					const res = await api.get(url, {
						params: { filter, fields, limit: -1 },
					});
					itemValues = res.data.data;
				}

				itemValues = [Object.assign({}, itemValues[0], items)];

				if (itemValues?.length > 0) {
					const emitValues = itemValues.map((el: any) => cast(el[props.lookupField])).filter((el: any) => el != null);

					emitValue(emitValues[0]);
				} else {
					emitValue(currentFieldObj.schema?.default_value ?? undefined);
				}
			} catch (err) {
				emitValue(undefined);
				console.log(err);
			} finally {
				loading.value = false;
			}
		}

		function cast(value: any) {
			if (value === null) return undefined;
			if (typeof value == 'object') value = JSON.stringify(value);
			if (typeof value == 'undefined') return undefined;

			const schema = currentFieldObj.schema;

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
