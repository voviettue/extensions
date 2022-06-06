import { defineHook } from '@directus/extensions-sdk';

export default defineHook(({ filter, action }) => {
	let hookFields: any = null;

	const getHookFields = async (database: any) => {
		if (hookFields === null) {
			hookFields = await database.from('directus_fields').where('interface', '=', 'interface-hook-action');
		}

		return hookFields;
	};

	action('items.create', async (event, context: any) => {
		const collection = event.collection;
		const fields = await getHookFields(context.database);

		fields.forEach((field: any) => {
			const options = JSON.parse(field.options);

			if (options.collection !== collection || options.action !== 'create') {
				return;
			}

			const fn = new Function(options.code);
			fn(event, context);
		});
	});

	action('items.update', async (event, context) => {
		const collection = event.collection;
		const fields = await getHookFields(context.database);

		fields.forEach((field: any) => {
			const options = JSON.parse(field.options);

			if (options.collection !== collection || options.action !== 'update') {
				return;
			}

			const fn = new Function(options.code);
			fn(event, context);
		});
	});

	action('items.delete', async (event, context) => {
		const collection = event.collection;
		const fields = await getHookFields(context.database);

		fields.forEach((field: any) => {
			const options = JSON.parse(field.options);

			if (options.collection !== collection || options.action !== 'delete') {
				return;
			}

			const fn = new Function(options.code);
			fn(event, context);
		});
	});

	// clear cache
	filter('fields.create', () => {
		hookFields = null;
	});

	filter('fields.update', () => {
		hookFields = null;
	});

	filter('fields.delete', () => {
		hookFields = null;
	});
});
