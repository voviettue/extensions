import { defineHook } from '@directus/extensions-sdk';

export default defineHook(({ filter }) => {

	let hookFields: any = null;

	const getHookFields = async (database: any) => {
		if (hookFields === null) {
			hookFields = await database.from('directus_fields').where('interface', '=', 'interface-hook-filter')
		}

		return hookFields
	}

	filter('items.create', async (input, event, context: any) => {
		const collection = event.collection
		const fields = await getHookFields(context.database)

		fields.forEach((field: any) => {
			const options = JSON.parse(field.options)

			if (options.collection !== collection || options.action !== "create") {
				return
			}

			const fn = new Function(options.code)
			fn(input, event, context)
		});
	});

	filter('items.update', async (input, event, context) => {
		const collection = event.collection
		const fields = await getHookFields(context.database)

		fields.forEach((field: any) => {
			const options = JSON.parse(field.options)

			if (options.collection !== collection || options.action !== "update") {
				return
			}

			const fn = new Function(options.code)
			fn(input, event, context)
		});
	});

	filter('items.delete', async (input, event, context) => {
		const collection = event.collection
		const fields = await getHookFields(context.database)

		fields.forEach((field: any) => {
			const options = JSON.parse(field.options)

			if (options.collection !== collection || options.action !== "delete") {
				return
			}

			const fn = new Function(options.code)
			fn(input, event, context)
		});
	});

	// clear cache
	filter('fields.create', () => {
		hookFields = null;
	})

	filter('fields.update', () => {
		hookFields = null;
	})

	filter('fields.delete', () => {
		hookFields = null;
	})
})
