<template>
	<div style="position: relative">
		<template v-if="!interfaceName">
			<v-input v-model="formattedValue" :disabled="disabled" :readonly="true">
				<template v-if="iconLeft" #prepend>
					<v-icon :name="iconLeft" />
				</template>
				<template v-if="!!iconRight" #append>
					<v-icon :name="iconRight" />
				</template>
			</v-input>
		</template>
		<template v-else>
			<component
				:is="interfaceName"
				:value="value"
				:disabled="disabled"
				:readonly="true"
				:type="currentField.type"
				:include-seconds="true"
			/>
		</template>
		<v-icon
			v-if="!!errorMessage"
			v-tooltip="errorMessage"
			style="color: var(--warning); position: absolute; top: -32px; right: 0"
			name="error"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import get from 'lodash/get';
import round from 'lodash/round';
import isNil from 'lodash/isNil';
import cloneDeep from 'lodash/cloneDeep';
import functions from './composables/functions';
import format from 'date-fns/format';
import { parseDate } from './composables/utils';

export default defineComponent({
	inject: ['values', 'stores', 'api'],
	props: {
		collection: {
			type: String,
			required: true,
		},
		field: {
			type: String,
			required: true,
		},
		value: {
			type: [String, Number],
			default: null,
		},
		template: {
			type: String,
			default: '',
		},
		thousandsSeparator: {
			type: String,
			default: '',
		},
		decimalSeparator: {
			type: String,
			default: '',
		},
		prefix: {
			type: String,
			default: '',
		},
		suffix: {
			type: String,
			default: '',
		},
		iconLeft: {
			type: String,
			default: null,
		},
		iconRight: {
			type: String,
			default: null,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['update:modelValue', 'input'],
	data() {
		return {
			oldValues: null,
			formulaValue: this.value,
			loading: false,
			errorMessage: null,
		};
	},
	computed: {
		fields() {
			const fieldsStore = this.stores.useFieldsStore();
			const fields = fieldsStore.getFieldsForCollection(this.collection);
			return fields;
		},
		currentField() {
			return this.fields.find((e) => e.field === this.field);
		},
		numberTypes() {
			return ['integer', 'bigInteger', 'decimal', 'float'];
		},
		dateTypes() {
			return ['date', 'dateTime', 'time', 'timestamp'];
		},
		interfaceName() {
			switch (this.currentField?.type) {
				// case "date":
				// case "dateTime":
				// case "time":
				// case "timestamp":
				//   return "interface-datetime";

				case 'boolean':
					return 'interface-boolean';

				default:
					return '';
			}
		},
		isNumberField() {
			return this.numberTypes.includes(this.currentField.type);
		},
		formattedValue() {
			let value = this.formulaValue;

			// number
			if (!isNil(value) && this.isNumberField) {
				value = this.formatNumber(value);
			}

			// date
			if (this.dateTypes.includes(this.currentField.type)) {
				return this.formatDate(value);
			}

			return this.prefix || this.suffix ? `${this.prefix ?? ''}${value ?? ''}${this.suffix ?? ''}` : value;
		},
		expressionKeys() {
			const regex = /({{.*?}})/g;
			const keys = [];
			this.template.split(regex).map((part: string) => {
				if (part.startsWith('{{') === false) return part;

				let fieldKey = part.replace(/{{/g, '').replace(/}}/g, '').trim();
				keys.push(fieldKey);
			});
			return keys;
		},
	},
	watch: {
		value: function () {
			this.formulaValue = this.value;
		},
		values: {
			handler: async function () {
				const values = this.values.value;
				for (var key of this.expressionKeys) {
					const fieldName = key.split('.').shift();
					if (this.oldValues !== null && values?.[fieldName] !== this.oldValues?.[fieldName]) {
						await this.execute();
						break;
					}
				}
				this.oldValues = cloneDeep(values);
			},
			deep: true,
		},
	},
	mounted() {
		if (this.$attrs['primary-key'] === '+' || !!this.$attrs['field-data']?.meta?.group) {
			this.execute();
		}
	},
	methods: {
		async execute() {
			this.errorMessage = null;
			try {
				const values = await this.getValues();
				const statement = this.expressionKeys.reduce((str, key) => {
					return str.replace(`{{${key}}}`, `PROP("${key}")`);
				}, this.template);

				this.formulaValue = this.getResult(statement, values);
				if (this.formulaValue !== this.value) {
					this.emitInput();
				}
			} catch (err) {
				this.errorMessage = err?.message;
				this.formulaValue = null;
				this.emitInput();
			}
		},
		emitInput() {
			setTimeout(() => {
				this.$emit('input', this.formulaValue);
			}, 50);
		},
		async getValues() {
			const values = {};
			for (var i in this.expressionKeys) {
				const path = this.expressionKeys[i];
				if (path.includes('.')) {
					values[path] = await this.getValueFromPath(path);
				} else {
					values[path] = this.getValueFromKey(path);
				}
			}
			return values;
		},
		async getValueFromPath(path) {
			const keys = path.split('.');
			const relationKey = keys.shift();
			const relationField = this.fields.find((e) => e.field === relationKey);
			const collection = relationField?.schema?.foreign_key_table;
			const collectionPK = relationField?.schema?.foreign_key_column;
			const value = this.getValueFromKey(relationKey);
			const id = value instanceof Object ? value?.[collectionPK] : value;
			if (!collection || !id) return null;

			const url = collection.startsWith('directus')
				? `${collection.replace('directus_', '')}/${id}`
				: `items/${collection}/${id}`;

			let item = await this.api.get(url);
			const data = item?.data?.data;
			item = value instanceof Object ? { ...data, ...value } : data;

			return get(item, keys.join('.'));
		},
		getValueFromKey(fieldKey: any) {
			const field = this.fields.find((e) => e.field === fieldKey);
			const isNumberField = this.numberTypes.includes(field.type);
			const defaultNullValue = isNumberField ? 0 : null;
			const value = get(this.values.value, field.field, field?.schema?.default_value || defaultNullValue);

			return value;
		},
		getResult(statement, values) {
			try {
				const {
					CONCATENATE,
					TRIM,
					LOWER,
					UPPER,
					LEN,
					AND,
					IF,
					OR,
					ABS,
					COUNT,
					AVERAGE,
					MAX,
					MIN,
					SUM,
					VALUE,
					DATEADD,
					DATESTR,
					DATETIME_DIFF,
					DATETIME_FORMAT,
					IS_AFTER,
					IS_BEFORE,
					IS_SAME,
					WEEKDAY,
					WEEKNUM,
					SECOND,
					MINUTE,
					HOUR,
					DAY,
					MONTH,
					YEAR,
					NOW,
					WORKDAY,
					WORKDAY_DIFF,
				} = functions;

				const fn = new Function('PROP', Object.keys(functions).join(','), `return ${statement}`);
				const PROP = (fieldKey) => {
					return values?.[fieldKey];
				};
				let result = fn(
					PROP,
					CONCATENATE,
					TRIM,
					LOWER,
					UPPER,
					LEN,
					AND,
					IF,
					OR,
					ABS,
					COUNT,
					AVERAGE,
					MAX,
					MIN,
					SUM,
					VALUE,
					DATEADD,
					DATESTR,
					DATETIME_DIFF,
					DATETIME_FORMAT,
					IS_AFTER,
					IS_BEFORE,
					IS_SAME,
					WEEKDAY,
					WEEKNUM,
					SECOND,
					MINUTE,
					HOUR,
					DAY,
					MONTH,
					YEAR,
					NOW,
					WORKDAY,
					WORKDAY_DIFF
				);

				if (isNaN(Number(result)) || result === Infinity) {
					return null;
				}

				return this.cast(result);
			} catch (err) {
				this.errorMessage = err?.name;
				return null;
			}
		},
		cast(value) {
			if (isNil(value) || value === '' || value === [] || value === {} || isNaN(Number(value)) || value === Infinity)
				return null;

			const schema = this.currentField.schema;

			if (typeof value === 'boolean') {
				value = value ? 1 : 0;
			}

			switch (this.currentField.type) {
				case 'decimal':
				case 'float':
					return round(value, schema.numeric_scale);

				case 'integer':
				case 'bigInteger':
					return round(value);

				case 'boolean':
					return !!value;

				case 'time':
					return this.convertTime(value);

				case 'date':
					return this.isValidDate(value) ? format(parseDate(value), 'yyyy-MM-dd') : null;

				case 'dateTime':
					return this.isValidDate(value) ? parseDate(value).toISOString().substring(0, 19) : null;

				case 'timestamp':
					return this.isValidDate(value) ? parseDate(value).toISOString() : null;

				default:
					return String(value);
			}
		},
		isValidDate(value) {
			if (isNil(value)) return false;

			const date = new Date(value);
			return date instanceof Date && !isNaN(date.getTime());
		},
		convertTime(value) {
			const regex = /^([0-9]+):([0-5]?[0-9]):([0-5]?[0-9])$/;
			const regexNoHour = /^([0-5]?[0-9]):([0-5]?[0-9])$/;

			// valid time
			if (String(value).match(regex) || String(value).match(regexNoHour)) {
				return value.split(':').length < 3 ? `${value}:00` : value;
			}

			// invalid number
			if (isNaN(Number(value))) return null;

			// valid number
			const seconds = Math.abs(parseInt(value)) || null;
			if (!seconds) return null;
			const hh = Math.floor(seconds / 3600);
			const mm = Math.floor((seconds - hh * 3600) / 60);
			const ss = seconds - hh * 3600 - mm * 60;
			return (
				`${String(hh).padStart(2, '0')}` +
				':' +
				`${String(mm).padStart(2, '0')}` +
				':' +
				`${String(ss).padStart(2, '0')}`
			);
		},
		formatNumber(number) {
			var str = String(number).split('.');

			str[0] = str[0] || '';
			var left = [];
			for (var i = str[0].length; i > 0; i -= 3) {
				left.unshift(str[0].substring(Math.max(0, i - 3), i));
			}
			str[0] = left.join(this.thousandsSeparator);

			return str.join(this.decimalSeparator || '.');
		},
		formatDate(value) {
			if (!value) return null;

			switch (this.currentField?.type) {
				case 'date':
					return format(parseDate(value), 'MMMM do, yyyy');

				case 'dateTime':
					return format(parseDate(value), 'MMMM do, yyyy HH:mm:ss');

				case 'timestamp':
					return format(parseDate(value), 'MMMM do, yyyy HH:mm:ss');

				default:
					return value;
			}
		},
	},
});
</script>
