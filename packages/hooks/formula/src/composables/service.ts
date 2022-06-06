import { Field } from '@directus/shared/types';
import get from 'lodash/get';
import round from 'lodash/round';
import functions from './functions';
import { numberTypes, parseDate, parseTime, getExpressionFieldKeys } from './utils';

export class Service {
	schemaFields: Field[];
	getSchema: Function;
	services: any;
	knex: any;

	constructor(schemaFields: Field[], getSchema: Function, services: any, knex: any) {
		this.schemaFields = schemaFields;
		this.getSchema = getSchema;
		this.services = services;
		this.knex = knex;

		return this;
	}

	cast = (value: any, schemaField: Field) => {
		if (typeof value === 'boolean') {
			value = value ? 1 : 0;
		}

		if (value === '' || value === [] || value === {} || value === null || value === NaN || value === Infinity) {
			return null;
		}

		switch (schemaField.type) {
			case 'decimal':
			case 'float':
				return round(value, schemaField.schema?.numeric_scale);

			case 'integer':
			case 'bigInteger':
				return round(value);

			case 'boolean':
				return !!value;

			case 'time':
				return parseTime(value);

			case 'date':
			case 'dateTime':
			case 'timestamp':
				return parseDate(value);

			default:
				return value;
		}
	};

	getResult(statement: any, values: any) {
		try {
			const PROP = (fieldKey: string) => {
				return values?.[fieldKey] || null;
			};

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

			return result;
		} catch (err: any) {
			console.log({ err, message: err?.message });
			return null;
		}
	}

	async getValues(payload: any, field: any) {
		const template = JSON.parse(field.options)?.template || '';
		const keys = getExpressionFieldKeys(template);
		const statement = keys.reduce((str: any, key: any) => {
			return str.replace(`{{${key}}}`, `PROP("${key}")`);
		}, template);

		const values: any = {};
		for (var i in keys) {
			const path: any = keys[i];
			if (path.includes('.')) {
				values[path] = await this.getValueFromPath(payload, path);
			} else {
				values[path] = this.getValueFromKey(payload, path);
			}
		}

		return { template, statement, values };
	}

	async getValueFromPath(payload: any, path: string) {
		const keys = path.split('.');
		const relationKey: any = keys.shift();
		const relationField = this.schemaFields.find((e: any) => e.field === relationKey);
		const collection = relationField?.schema?.foreign_key_table;
		const id = this.getValueFromKey(payload, relationKey);

		if (!collection || !id) return '';

		const { ItemsService } = this.services;
		const schema = await this.getSchema();
		const itemsService = new ItemsService(collection, {
			accountability: null,
			schema: schema,
			knex: this.knex,
		});

		const item = await itemsService.readOne(id, { fields: [keys.join('.')] });
		return get(item, keys.join('.'), null);
	}

	getValueFromKey(input: any, fieldKey: any) {
		const field = this.schemaFields.find((e: any) => e.field === fieldKey);
		if (!field) return null;

		const isNumberField = numberTypes.includes(field.type);
		const defaultNullValue = isNumberField ? 0 : '';
		const value = get(input, fieldKey, field?.schema?.default_value || defaultNullValue);
		return value;
	}
}
