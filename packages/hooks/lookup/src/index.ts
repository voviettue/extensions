import { defineHook } from '@directus/extensions-sdk';
import round from 'lodash/round';
import { parse, isValid } from 'date-fns';

export default defineHook(({ action }, { services, database, getSchema, logger }) => {
	let _lookupFields: any = null;
	let _schemaFields: any = null;

	const getLookupFields = async (collection: string) => {
		if (_lookupFields === null) {
			_lookupFields = await database.from('directus_fields')
				.where('interface', '=', 'input-lookup');
		}

		return _lookupFields.filter((field: any) => field.collection === collection);
	}

	const getSchemaFields = async (collection: string) => {
		if (_schemaFields === null) {
			const fieldsService = new services.FieldsService({ knex: database, schema: await getSchema() });
			_schemaFields = await fieldsService.readAll(collection);
		}
		return _schemaFields.filter((schema: any) => !collection || schema.collection === collection);
	}

	const cast = (value: any, fieldSchema: any) => {
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
				return String(value).substring(0, fieldSchema?.schema?.max_length || null);

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

	const getMappingFields = (collection: string, lookupFields: any[], schema: any) => {
		const mapper: any = [];
		const relations = schema.relations.filter((relation: any) => relation?.meta?.many_collection == collection);

		for (var i in lookupFields) {
			const field = lookupFields[i];

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
	}

	const execute = async (obj: any, ctx: any) => {
		const lookupFields = await getLookupFields(obj.collection);

		if (lookupFields.length === 0) return;

		try {
			const keys = obj?.key ? [obj.key] : obj.keys;
			const collection = obj.collection;
			const pk = ctx.schema.collections[collection].primary;
			const schema = await getSchema();
			const fieldSchemas = await getSchemaFields(collection);
			const mapper = getMappingFields(collection, lookupFields, schema);

			for (var i in keys) {
				const key = keys[i];
				const payload: any = {};
				const record = await database(collection).where(pk, key).first();

				if (!record) continue;

				for (var i in mapper) {
					const option = mapper[i];
					payload[option.field] = null;

					if (record?.[option.relationField]) {
						const item = await database
							.select(option.lookupField)
							.from(option.lookupCollection)
							.where(option.lookupCollectionPK, record[option.relationField])
							.first();
						if (item) {
							const fieldSchema = fieldSchemas.find((schema: any) => schema.field === option.field);
							payload[option.field] = cast(item?.[option.lookupField], fieldSchema);
						}
					}
				}

				if (Object.keys(payload).length > 0) {
					await database(collection)
						.update(payload)
						.where(pk, key);
					logger.info(`LOOKUP: UPDATE ${collection}:${key} - ${JSON.stringify(payload)}`);
				}
			}
		} catch (error: any) {
			logger.error(`LOOKUP: ${error.toString()}`);
		}
	}

	action('items.create', async (obj: any, ctx: any) => {
		await execute(obj, ctx);
	});

	action('items.update', async (obj: any, ctx: any) => {
		await execute(obj, ctx);
	});

	action('fields.create', () => {
		_lookupFields = null;
		_schemaFields = null;
	});

	action('fields.update', () => {
		_lookupFields = null;
		_schemaFields = null;
	});

	action('fields.delete', () => {
		_lookupFields = null;
		_schemaFields = null;
	});
});
