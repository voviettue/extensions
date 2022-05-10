import { defineHook } from '@directus/extensions-sdk';
import get from 'lodash/get'
import round from 'lodash/round'
import functions from './functions';

export default defineHook(({ filter, action }, { database }) => {
	const numberTypes = ['integer', '"bigInteger"', 'decimal', 'float']
	const getSchema = async (ctx: any, collection: any) => {
		const infoSchemas = await ctx.database.raw(`describe ${collection}`)
		const fields: any = {}
		infoSchemas[0].forEach((e: any) => {
			const fieldSchema = ctx.schema.collections[collection].fields[e.Field]
			const matches = e.Type.match(/\d+/g)
			fields[e.Field] = {
				default: e.Default,
				precision: matches && matches[0],
				scale: matches && matches[1],
				type: fieldSchema.type,
				dbType: fieldSchema.dbType,
			}
		})
		return fields
	}

	const getFormulaFields = (collection: string) => {
		return database.from('directus_fields')
			.where('collection', '=', collection)
			.andWhere('interface', '=', 'input-formula')
	}

	const cast = (value: any, field: any) => {
		if (typeof value === 'boolean') {
			value = value ? 1 : 0;
		}

		switch (field.type) {
			case 'decimal':
			case 'float':
				return round(value, field.scale || 2);

			case 'int':
			case 'bigint':
				return round(value);

			default:
				return value;
		}
	}

	const getStatement = (template: string) => {
		const regex = /({{.*?}})/g;
		return template
			.split(regex)
			.map((part: string) => {
				if (part.startsWith('{{') === false) return part;

				let fieldKey = part.replace(/{{/g, '').replace(/}}/g, '').trim();
				return `PROP('${fieldKey}')`;
			})
			.join('');
	}

	const getValue = (input: any, fieldKey: any, fields: any) => {
		const field = fields[fieldKey];
		const isNumberField = numberTypes.includes(field.type);
		const defaultNullValue = isNumberField ? 0 : '';
		const value = get(input, fieldKey, (field && field.default) || defaultNullValue);
		return value;
	}

	const getResult = (template: any, currentField: any, input: any, fields: any) => {
		const statement = getStatement(template)
		const isNumberField = numberTypes.includes(fields[currentField.field].type);
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
				DATETIME_DIFF,
				SECOND,
				MINUTE,
				HOUR,
				DAY,
				MONTH,
				YEAR,
				NOW,
				WORKDAY_DIFF
			} = functions;
			const fn = new Function('PROP', Object.keys(functions).join(','), `return ${statement}`);
			const PROP = (fieldKey: string) => {
				return getValue(input, fieldKey, fields);
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
				DATETIME_DIFF,
				SECOND,
				MINUTE,
				HOUR,
				DAY,
				MONTH,
				YEAR,
				NOW,
				WORKDAY_DIFF
			);

			if (result === NaN|| result === Infinity) {
				return null
			}

			return cast(result, currentField);
		} catch (err: any) {
			console.log({ err, message: err?.message });
			return null;
		}
	}

	// Before create record
	filter('items.create', async (input: any, obj: any, ctx: any) => {
		const collection = obj.collection
		const formulaFields = await getFormulaFields(collection)

		if (formulaFields.length === 0) {
			return
		}

		const schema = await getSchema(ctx, collection)
		formulaFields.forEach((field: any) => {
			const template = JSON.parse(field.options).template || ''
			const result = getResult(template, field, input, schema)
			input[field.field] = cast(result, schema[field.field])
		})
	});

	// Before update a record
	filter('items.update', async (input, obj, ctx: any) => {
		const collection = obj.collection
		const formulaFields = await getFormulaFields(collection)

		if (formulaFields.length === 0 || obj.keys.length > 1) {
			return
		}

		const id = obj.keys[0]
		const pk = ctx.schema.collections[collection].primary;
		const record = await ctx.database.from(collection).where(pk, '=', id).first()
		const schema = await getSchema(ctx, collection)
		const payload = { ...record, ...input }

		formulaFields.forEach((field: any) => {
			const template = JSON.parse(field.options).template || ''
			const result = getResult(template, field, payload, schema)
			input[field.field] = cast(result, schema[field.field])
		})
	});

	// After update multiple record
	action('items.update', async (event: any, ctx: any) => {
		const collection = event.collection
		const formulaFields = await getFormulaFields(collection)

		if (formulaFields.length === 0 || event.keys.length <= 1) {
			return
		}

		event.keys.forEach(async (id: any) => {
			const pk = ctx.schema.collections[collection].primary;
			const record = await ctx.database.from(collection).where(pk, '=', id).first()
			const schema = await getSchema(ctx, collection)
			const payload = {} as any
			formulaFields.forEach((field: any) => {
				const template = JSON.parse(field.options).template || ''
				const result = getResult(template, field, record, schema)
				payload[field.field] = cast(result, schema[field.field])
			})
			await ctx.database.from(collection).update(payload).where('id', '=', id)
		});
	});
});
