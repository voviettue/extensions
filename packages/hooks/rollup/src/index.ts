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

export default defineHook(({ action }, { services, database, getSchema, logger }) => {
	const getRollupFields = (collection: string) => {
		return database.from('directus_fields')
			.where('collection', '=', collection)
			.andWhere('interface', '=', 'input-rollup');
	}

	const rollupQuery = async (obj: any, ctx: any, fieldSchema: any, key :Number) => {
		const fieldOptions = fieldSchema.meta?.options || '';

		const o2mCollection = fieldOptions.o2mCollection;
		const o2mField = fieldOptions.o2mField;
		const relatedFilter = fieldOptions.filter;
		const sortBy = fieldOptions.sortBy;
		const rollupFunction = fieldOptions.function;

		if (!o2mCollection || !o2mField || !rollupFunction) {
			logger.error(`ROLLUP: [${obj.collection}: ${key}] with [${fieldSchema.field}: Invalid relatedCollection or relatedCollectionField or rollupFunction`);
			return null;
		}

		const schema = await getSchema();
		const itemsService = new services.ItemsService(o2mCollection, { knex: ctx.database, schema });

		const relation = ctx.schema.relations.find(
			(relation: any) =>
				relation.collection === o2mCollection
				&& relation.related_collection === obj.collection
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

				return calculate(
					result.filter((el: any) =>
						el.hasOwnProperty(o2mField)
						&& !['null', '', '[]', '{}'].includes(JSON.stringify(el[o2mField]))
					),
					rollupFunction,
					o2mField,
					sortBy
				);
			}
		} catch (error) {
			logger.error(error);

			return undefined;
		}
	}

	const cast = async (value: any, fieldSchema: any) => {
		if (typeof value == 'object') {
			value = JSON.stringify(value);
		}

		if (typeof value == 'undefined' || value == 'null') {
			return null;
		}

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
		if (func != 'count' && input.length == 0) return;

		if (['count', 'sum', 'avg', 'min', 'max'].includes(func)) {
			input = input.map((el: any) => el[o2mField]);
		}

		switch (func) {
			case 'count':
				return input.length;

			case 'sum':
				return sum(input) || 0;

			case 'avg':
				return mean(input) || 0;

			case 'min':
				return min(input) || 0;

			case 'max':
				return max(input) || 0;

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
				const rollupFields = await getRollupFields(obj.collection);

				if (rollupFields.length === 0) return;

				rollupFields.forEach(async field => {
					const fieldsService = new services.FieldsService({ schema: await getSchema() });
					const fieldSchema = await fieldsService.readOne(field.collection, field.field);

					const queryResult = await rollupQuery(obj, ctx, fieldSchema, key);
					const updateValue = await cast(queryResult, fieldSchema);

					logger.info(`ROLLUP: ${type.toUpperCase()} [${collection}: ${key}] with [${field.field}: ${updateValue}]`);

					try {
						await ctx.database(obj.collection)
							.update({ [field.field]: updateValue })
							.where(pk, '=', key);
					} catch (error) {
						logger.error(error);
					}
				});
			});
		} catch (error) {
			logger.error('ROLLUP: Execution failed')
			logger.error(error);
		}
	}

	action('items.create', async (obj: any, ctx: any) => {
		await execute(obj, ctx, 'create');
	});

	action('items.update', async (obj: any, ctx: any) => {
		await execute(obj, ctx, 'update');
	});
});
