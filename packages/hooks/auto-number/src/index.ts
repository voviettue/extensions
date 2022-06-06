import { defineHook } from '@directus/extensions-sdk';
import { generateAutoNumber, convertPlaceholder, getNextNumber } from './utils';

interface AutoNumberHookOptions {
	startNumber: number;
	minNumberOfDigits: number;
	prefix: string;
}

export default defineHook(({ filter }, { logger }) => {
	filter('items.create', async (input: any, meta: any, ctx: any) => {
		const fields = await getAutoNumberFields(ctx, meta.collection);

		for (const field of fields) {
			const options: AutoNumberHookOptions = withDefaults(JSON.parse(field.options));
			const parsedPrefix = convertPlaceholder(options.prefix);
			const latestNumber = await getLatestNumber(ctx, meta, field.field, parsedPrefix);
			const nextNumber = getNextNumber(latestNumber, options.startNumber);
			input[field.field] = generateAutoNumber(parsedPrefix, nextNumber, options.minNumberOfDigits);
			logger.info(`[AUTO_NUMBER] Generated number for ${field.field}: ${input[field.field]}`);
		}

		return input;
	});

	filter('items.update', async (input: any, meta: any, ctx: any) => {
		const fields = await getAutoNumberFields(ctx, meta.collection);

		fields.forEach((field: any) => {
			if (input.hasOwnProperty(field.field)) {
				delete input[field.field];
			}
		});

		return input;
	});

	async function getLatestNumber(ctx: any, collection: string, field: string, prefix: string): Promise<null | number> {
		const data = await ctx.database
			.from(collection)
			.where(field, 'like', prefix + '%')
			.orderBy(ctx.database.raw(`replace(${field}, '${prefix}', '') * 1`), 'desc')
			.limit(1);

		if (data.length === 0) {
			return null;
		}

		let number = data[0][field];
		number = number.replace(prefix, '');
		number = parseInt(number);

		return number;
	}

	async function getAutoNumberFields(ctx: any, collection: string) {
		return await ctx.database
			.from('directus_fields')
			.where('interface', '=', 'auto-number')
			.andWhere('collection', '=', collection);
	}

	function withDefaults(options: AutoNumberHookOptions): AutoNumberHookOptions {
		options.startNumber = options.startNumber || 1;
		options.minNumberOfDigits = options.minNumberOfDigits || 1;
		options.prefix = options.prefix || '';

		return options;
	}
});
