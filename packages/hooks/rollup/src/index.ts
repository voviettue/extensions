import { defineHook } from '@directus/extensions-sdk';
import merge from 'lodash/merge';
import round from 'lodash/round';
import sum from 'lodash/sum';
import mean from 'lodash/mean';
import min from 'lodash/min';
import max from 'lodash/max';
import first from 'lodash/first';
import orderBy from 'lodash/orderBy';
import { parse, isValid } from 'date-fns';

export default defineHook(({ action }, { services, getSchema, logger }) => {
	const getRollupFields = (ctx: any, collection: string) => {
		return ctx.database.from('directus_fields')
			.where('collection', '=', collection)
			.andWhere('interface', '=', 'input-rollup');
	}

	const rollupQuery = async (obj: any, ctx: any, fieldSchema: any, key :Number) => {
		const fieldOptions = fieldSchema.meta?.options;

		const [o2mCollection, oneField] = fieldOptions?.o2mCollection?.split('-');
		const o2mField = fieldOptions?.o2mField;
		const relatedFilter = fieldOptions?.filter;
		const sortBy = fieldOptions?.sortBy;
		const rollupFunction = fieldOptions?.function;

		if (!o2mCollection || !oneField || !o2mField || !rollupFunction) {
			logger.error(`ROLLUP: [${obj.collection}: ${key}] with [${fieldSchema.field}: Invalid relatedCollection or relatedCollectionField or rollupFunction`);
			return null;
		}

		const itemsService = new services.ItemsService(
			o2mCollection, { knex: ctx.database, schema: ctx.schema }
		);

		const relation = ctx.schema.relations.find(
			(relation: any) =>
				relation.collection == o2mCollection
				&& relation.related_collection == obj.collection
				&& relation?.meta?.one_field == oneField
		);

		const filter = { [relation.field]: { '_eq': key } };

		try {
			const existedRecord = await itemsService.readByQuery({ filter, limit: -1 });

			if (existedRecord.length == 0) {
				return fieldSchema?.schema?.default_value;
			} else {
				const result = await itemsService.readByQuery({
					filter: merge(relatedFilter, filter),
					limit: -1
				});

				return calculate(result, rollupFunction, o2mField, sortBy);
			}
		} catch (error: any) {
			logger.error(`ROLLUP: ${error.toString()}`);

			return undefined;
		}
	}

	const cast = async (value: any, fieldSchema: any) => {
		if (value === null) return null;
		if (typeof value == 'object') value = JSON.stringify(value);
		if (typeof value == 'undefined') return null;

		switch (fieldSchema?.schema?.data_type) {
			case 'decimal':
			case 'float':
				return round(value, fieldSchema?.schema?.numeric_scale || 2) ?? 0;

			case 'int':
			case 'bigint':
				return round(value) ?? 0;

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
			case 'varchar':
			case 'char':
				return value.toString().substring(0, fieldSchema?.schema?.max_length);

			case 'time':
				const parsedTime = parse(value, 'HH:mm:ss', new Date());
				return isValid(parsedTime) ? value : null;

			case 'datetime':
			case 'date':
			case 'timestamp':
				return new Date(value) || null;

			default:
				return value;
		}
	}

	function calculate(input: Array<any>, func: string, o2mField: string, sortBy: string) {
		switch (func) {
			case 'counta': // Count all including empty or null values
				input = input.map((el: any) => el[o2mField]);
				break;

			case 'countd': // Count unique values
				input = input.map((el: any) => el[o2mField])
					.filter((el: any, index: number, self: any[]) => (el != null && el != '') && self.indexOf(el) === index);
				break;

			case 'countn': // Count empty and null values
				input = input.map((el: any) => el[o2mField]).filter((el: any) => el == null || el == '');
				break;

			case 'count': // Count non-empty and not null values
			case 'sum':
			case 'avg':
			case 'min':
			case 'max':
				input = input.map((el: any) => el[o2mField]).filter((el: any) => el != null && el != '');
				break;
		}

		if (!['count', 'counta', 'countd', 'countn'].includes(func) && input.length == 0) return undefined;

		switch (func) {
			case 'count':
			case 'counta':
			case 'countd':
			case 'countn':
				return input.length;

			case 'sum':
				return sum(input);

			case 'avg':
				return mean(input);

			case 'min':
				return min(input);

			case 'max':
				return max(input);

			case 'first':
				return first(orderBy(input, [sortBy], 'asc'))?.[o2mField];

			case 'last':
				return first(orderBy(input, [sortBy], 'desc'))?.[o2mField];
		}
	}

	const execute = async (obj :any, ctx: any, type: string) => {
		try {
			const collection = obj.collection;
			const keys = type == 'create' ? [obj.key] : obj.keys;
			keys?.forEach(async (key: Number) => {
				const pk = ctx.schema.collections[collection].primary;
				const rollupFields = await getRollupFields(ctx, obj.collection);

				if (rollupFields.length === 0) return;

				rollupFields.forEach(async (field: any) => {
					try {
						const fieldsService = new services.FieldsService({ knex: ctx.database, schema: ctx.schema });
						const fieldSchema = await fieldsService.readOne(field.collection, field.field);

						const queryResult = await rollupQuery(obj, ctx, fieldSchema, key);
						const updateValue = await cast(queryResult, fieldSchema);

						logger.info(`ROLLUP: ${type.toUpperCase()} [${collection}: ${key}] with [${field.field}: ${updateValue}]`);

						await ctx.database(obj.collection)
							.update({ [field.field]: updateValue })
							.where(pk, '=', key);
					} catch (error: any) {
						logger.error(`ROLLUP: ${error.toString()}`);
					}
				});
			});
		} catch (error: any) {
			logger.error(`ROLLUP: ${error.toString()}`);
		}
	}

	action('items.create', async (obj: any, ctx: any) => {
		await execute(obj, ctx, 'create');
	});

	action('items.update', async (obj: any, ctx: any) => {
		await execute(obj, ctx, 'update');
	});
});
