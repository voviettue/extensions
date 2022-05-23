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
	let _rollupFields: any = null;
	let _schemaFields: any = null;

	const getRollupFields = async (collection: string) => {
		if (_rollupFields === null) {
			_rollupFields = await database.from('directus_fields')
				.where('interface', '=', 'input-rollup');
		}

		return _rollupFields.filter((field: any) => field.collection === collection);
	}

	const getSchemaFields = async (collection: string) => {
		if (_schemaFields === null) {
			const fieldsService = new services.FieldsService({ knex: database, schema: await getSchema() });
			_schemaFields = await fieldsService.readAll(collection);
		}
		return _schemaFields.filter((schema: any) => !collection || schema.collection === collection);
	}

	const getMappingFields = (collection: string, rollupFields: any[], schema: any) => {
		const mapper: any = [];
		const relations = schema.relations.filter((relation: any) => relation?.meta?.one_collection == collection);

		for (var i in rollupFields) {
			const field = rollupFields[i];

			const {
				relationField, rollupField,
				function: rollupFunction, sortBy, filter
			} = JSON.parse(field?.options) || {};
			const relation = relations.find((relation: any) => relation?.meta?.one_field == relationField);
			const relatedCollection = relation?.collection;
			const relatedCollectionFK = relation?.field;

			if (!relationField || !rollupField || !rollupFunction) {
				logger.warn(`ROLLUP: Invalid option: ${collection}.${field.field}`);
				continue;
			}

			if (!relation) {
				logger.warn(`ROLLUP: Not found relation: ${collection}.${field.field}`);
				continue;
			}

			mapper.push({
				field: field.field,
				relationField: relationField,
				rollupCollection: relatedCollection,
				rollupCollectionFK: relatedCollectionFK,
				rollupField: rollupField,
				rollupFunction: rollupFunction,
				sortBy: sortBy,
				filter: filter,
			});
		}

		return mapper;
	}

	const cast = (value: any, fieldSchema: any) => {
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

	function calculate(input: Array<any>, func: string, rollupField: string, sortBy: string) {
		if (!['count', 'counta', 'countd', 'countn'].includes(func) && input.length == 0) return undefined;

		switch (func) {
			case 'counta': // Count all including empty or null values
				input = input.map((el: any) => el[rollupField]);
				break;

			case 'countd': // Count unique values
				input = input.map((el: any) => el[rollupField])
					.filter((el: any, index: number, self: any[]) => (el != null && el != '') && self.indexOf(el) === index);
				break;

			case 'countn': // Count empty and null values
				input = input.map((el: any) => el[rollupField]).filter((el: any) => el == null || el == '');
				break;

			case 'count': // Count non-empty and not null values
			case 'sum':
			case 'avg':
			case 'min':
			case 'max':
				input = input.map((el: any) => el[rollupField]).filter((el: any) => el != null && el != '');
				break;
		}

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
				return first(orderBy(input, [sortBy], 'asc'))?.[rollupField];

			case 'last':
				return first(orderBy(input, [sortBy], 'desc'))?.[rollupField];
		}
	}

	const execute = async (obj: any, ctx: any) => {
		const rollupFields = await getRollupFields(obj.collection);

		if (rollupFields.length === 0) return;

		try {
			const keys = obj?.key ? [obj.key] : obj.keys;
			const collection = obj.collection;
			const pk = ctx.schema.collections[collection].primary;
			const schema = await getSchema();
			const fieldSchemas = await getSchemaFields(collection);
			const mapper = getMappingFields(collection, rollupFields, schema);

			for (var i in keys) {
				const key = keys[i];
				const payload: any = {};
				const record = await database(collection).where(pk, key).first();

				if (!record) continue;

				for (var i in mapper) {
					const option = mapper[i];
					payload[option.field] = null;

					if (record) {
						const rollupCollectionItemsService = new services.ItemsService(
							option.rollupCollection, { knex: database, schema: await getSchema() }
						);
						const filter = { [option.rollupCollectionFK]: { '_eq': key } };
						const items = await rollupCollectionItemsService.readByQuery({
							filter: merge(option.filter, filter),
							limit: -1
						});

						if (items) {
							const fieldSchema = fieldSchemas.find((schema: any) => schema.field === option.field);
							const castedItems = items.map((el: any) => {
								el[option.rollupField] = cast(el[option.rollupField], fieldSchema);
								return el;
							});

							payload[option.field] = calculate(
								castedItems, option.rollupFunction,
								option.rollupField, option.sortBy
							) ?? fieldSchema?.schema?.default_value;
						}
					}
				}

				if (Object.keys(payload).length > 0) {
					await database(collection)
						.update(payload)
						.where(pk, key);
					logger.info(`ROLLUP: UPDATE ${collection}:${key} - ${JSON.stringify(payload)}`);
				}
			}
		} catch (error: any) {
			logger.error(`ROLLUP: ${error.toString()}`);
		}
	}

	action('items.create', async (obj: any, ctx: any) => {
		await execute(obj, ctx);
	});

	action('items.update', async (obj: any, ctx: any) => {
		await execute(obj, ctx);
	});

	action('fields.create', () => {
		_rollupFields = null;
		_schemaFields = null;
	});

	action('fields.update', () => {
		_rollupFields = null;
		_schemaFields = null;
	});

	action('fields.delete', () => {
		_rollupFields = null;
		_schemaFields = null;
	});
});
