import { defineHook } from '@directus/extensions-sdk';
import get from 'lodash/get';
import round from 'lodash/round';
import { parse, isValid } from 'date-fns';
import { LookupMap } from './types';
import { Field } from '@directus/shared/types';

export default defineHook(({ filter, action }, { services, database, getSchema, logger }) => {
	const interfaceName = 'input-lookup';
	let _lookupFields: any = null;
	let _schemaFields: any = null;
	let _items: any = {};

	const getLookupFields = async (collection: string) => {
		if (_lookupFields === null) {
			_lookupFields = await database.from('directus_fields').where('interface', '=', interfaceName);
		}

		return _lookupFields.filter((field: any) => field.collection === collection);
	};

	const getSchemaFields = async (collection: string): Promise<Field[]> => {
		if (_schemaFields === null) {
			const fieldsService = new services.FieldsService({ knex: database, schema: await getSchema() });
			_schemaFields = await fieldsService.readAll(collection);
		}
		return _schemaFields.filter((schema: any) => !collection || schema.collection === collection);
	};

	const clearCache = () => {
		_lookupFields = null;
		_schemaFields = null;
	};

	const cast = (value: any, fieldSchema: Field) => {
		if (value === null) return null;
		if (typeof value == 'object') value = JSON.stringify(value);
		if (typeof value == 'undefined') return null;

		switch (fieldSchema?.schema?.data_type) {
			case 'decimal':
			case 'float':
				return value === 0 ? 0 : round(value, fieldSchema?.schema?.numeric_scale || 2);

			case 'int':
			case 'bigint':
				return value === 0 ? 0 : round(value);

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
				return String(value).substring(0, fieldSchema?.schema?.max_length || undefined);

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
	};

	const getLookupMaps = (collection: string, lookupFields: any[], schema: any): LookupMap[] => {
		const mapper: LookupMap[] = [];
		const relations = schema.relations.filter((relation: any) => relation?.meta?.many_collection == collection);

		for (var field of lookupFields) {
			const { relationField, lookupField } = JSON.parse(field?.options) || {};
			const relation = relations.find((relation: any) => relation.field == relationField);
			const relatedCollection = relation?.related_collection;

			if (!relationField || !lookupField) {
				logger.warn(`LOOKUP: Invalid option: ${collection}.${field.field}`);
				continue;
			}

			if (!relation) {
				logger.warn(`LOOKUP: Not found relation: ${collection}.${field.field}`);
				continue;
			}

			mapper.push({
				field: field.field,
				relationField: relationField,
				lookupCollection: relatedCollection,
				lookupCollectionPK: schema.collections[collection].primary,
				lookupField: lookupField,
			});
		}

		return mapper;
	};

	const getItem = async (value: any, map: LookupMap, ctx: any) => {
		const id = value instanceof Object ? value?.[map.lookupCollectionPK] : value;
		const key = `${map.lookupCollection}.${id}.${map.lookupField}`;
		const itemService = new services.ItemsService(map.lookupCollection, {
			knex: ctx.database,
			schema: await getSchema(),
		});
		if (!_items?.[key]) {
			try {
				_items[key] = await itemService.readOne(id, { fields: [map.lookupField] });
			} catch {
				return null;
			}
		}
		const item = _items[key] ?? {};
		let result = value instanceof Object ? { ...item, ...value } : item;

		return result;
	};

	const execute = async (collection: any, input: any, ctx: any) => {
		const lookupFields = await getLookupFields(collection);
		if (lookupFields.length === 0) return;

		try {
			const schema = await getSchema();
			const fieldSchemas = await getSchemaFields(collection);
			const lookupMaps = getLookupMaps(collection, lookupFields, schema);

			for (var map of lookupMaps) {
				if (!input?.[map.relationField]) continue;

				const item = await getItem(input[map.relationField], map, ctx);
				if (item) {
					const fieldSchema = fieldSchemas.find((schema: any) => schema.field === map.field);
					if (!fieldSchema) continue;

					const value = get(item, map.lookupField);
					input[map.field] = cast(value, fieldSchema);
				}
			}
		} catch (error: any) {
			logger.error(`LOOKUP: ${error.toString()}`);
		} finally {
			_items = {};
		}
	};

	filter('items.create', async (input: any, event: any, ctx: any) => {
		const collection = event.collection;
		await execute(collection, input, ctx);
		return input;
	});

	filter('items.update', async (input: any, event: any, ctx: any) => {
		const collection = event.collection;
		await execute(collection, input, ctx);
		return input;
	});

	// update meta.special for type alias
	filter('fields.create', async (input: any) => {
		if (input?.meta?.interface !== interfaceName) return;

		input.meta.special = input.type === 'alias' ? ['alias', 'no-data'] : null;
	});

	action('fields.create', () => {
		clearCache();
	});

	action('fields.update', () => {
		clearCache();
	});

	action('fields.delete', () => {
		clearCache();
	});
});
