import { defineHook } from '@directus/extensions-sdk';
import { Field } from '@directus/shared/types';
import { Service } from './composables/service';

export default defineHook(({ action }, { logger, services, database, getSchema }) => {
	let _formulaFields: any = null;
	let _schemaFields: any = null;

	const getFormulaFields = async (collection: string) => {
		if (_formulaFields === null) {
			_formulaFields = await database
				.from('directus_fields')
				.where('collection', '=', collection)
				.andWhere('interface', '=', 'input-formula');
		}

		return _formulaFields;
	};

	const getSchemaFields = async (collection: string): Promise<Field[]> => {
		if (_schemaFields === null) {
			const fieldsService = new services.FieldsService({ knex: database, schema: await getSchema() });
			_schemaFields = await fieldsService.readAll(collection);
		}
		return _schemaFields.filter((schema: any) => !collection || schema.collection === collection);
	};

	const clearCache = () => {
		_formulaFields = null;
		_schemaFields = null;
	};

	const updateFormulaFields = async (collection: any, id: any, ctx: any) => {
		const pk = ctx.schema.collections[collection].primary;
		const record = await ctx.database.from(collection).where(pk, '=', id).first();
		const formulaFields = await getFormulaFields(collection);
		const schemaFields = await getSchemaFields(collection);
		const service = new Service(schemaFields, getSchema, services, database);
		const payload: any = {};

		for (var field of formulaFields) {
			const schemaField = schemaFields.find((e: any) => e.field === field.field);
			if (!schemaField) continue;

			const { statement, values } = await service.getValues(record, field);
			const result = service.getResult(statement, values);
			const value = service.cast(result, schemaField);
			if (record?.[field.field] === value) continue;

			payload[field.field] = value;
		}

		if (Object.keys(payload).length) {
			if (ctx.database.isCompleted()) {
				await database(collection).update(payload).where(pk, id);
			} else {
				await ctx.database(collection).update(payload).where(pk, id);
			}
		}
	};

	const execute = async (collection: any, ids: any, ctx: any) => {
		const formulaFields = await getFormulaFields(collection);
		if (formulaFields.length === 0) return;

		try {
			for (var id of ids) {
				await updateFormulaFields(collection, id, ctx);
			}
		} catch (err) {
			logger.error(err);
		}
	};

	action('items.create', async (event: any, ctx: any) => {
		const ids = [event.key];
		execute(event.collection, ids, ctx);
	});

	action('items.update', async (event: any, ctx: any) => {
		const ids = event.keys;
		execute(event.collection, ids, ctx);
	});

	// clear cache
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
