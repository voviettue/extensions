// /* eslint-disable no-irregular-whitespace, no-undef */
const { BaseException } = require('@directus/shared/exceptions');

module.exports = {
	async up(knex) {
		const trx = await knex.transaction();

		try {
			await trx.schema.createTable('cms_ledger_collections', (table) => {
				table.increments('id');
				table.string('collection').unique('collection', { indexName: 'cms_ledger_collections_key_unique' });
				table.json('fields');
			});

			await trx.schema.createTable('cms_ledger_docs', (table) => {
				table.string('item_id');
				table.string('doc_id').primary();
				table.string('collection');
				table.timestamp('created_at').defaultTo(knex.fn.now());
			});

			const collections = [{ collection: 'cms_ledger_collections' }, { collection: 'cms_ledger_docs' }];
			await trx.insert(collections).into('directus_collections');

			const fields = [
				{
					collection: 'cms_ledger_collections',
					field: 'id',
					special: null,
					interface: 'input',
					options: null,
					readonly: 0,
					hidden: 0,
					sort: null,
					width: 'full',
					required: 0,
				},
				{
					collection: 'cms_ledger_collections',
					field: 'collection',
					special: null,
					interface: 'input',
					options: null,
					readonly: 0,
					hidden: 0,
					sort: null,
					width: 'full',
					required: 0,
				},
				{
					collection: 'cms_ledger_collections',
					field: 'fields',
					special: null,
					interface: 'input',
					options: null,
					readonly: 0,
					hidden: 0,
					sort: null,
					width: 'full',
					required: 0,
				},
				{
					collection: 'cms_ledger_docs',
					field: 'doc_id',
					special: null,
					interface: 'input',
					options: null,
					readonly: 1,
					hidden: 0,
					sort: null,
					width: 'full',
					required: 0,
				},
				{
					collection: 'cms_ledger_docs',
					field: 'item_id',
					special: null,
					interface: 'input',
					options: null,
					readonly: 0,
					hidden: 0,
					sort: null,
					width: 'full',
					required: 0,
				},
				{
					collection: 'cms_ledger_docs',
					field: 'collection',
					special: null,
					interface: 'input',
					options: null,
					readonly: 0,
					hidden: 0,
					sort: null,
					width: 'full',
					required: 0,
				},
				{
					collection: 'cms_ledger_docs',
					field: 'created_at',
					special: null,
					interface: 'datetime',
					options: null,
					readonly: 0,
					hidden: 0,
					sort: null,
					width: 'full',
					required: 0,
				},
			];
			await knex.insert(fields).into('directus_fields');
			await trx.commit();
		} catch (error) {
			await knex.schema.dropTableIfExists('cms_ledger_collections').dropTableIfExists('cms_ledger_docs');
			throw new BaseException(error?.message, error?.status);
		}
	},
	async down(knex) {
		try {
			await knex.schema.dropTableIfExists('cms_ledger_collections').dropTableIfExists('cms_ledger_docs');
			await knex('directus_collections').whereIn('collection', ['cms_ledger_collections', 'cms_ledger_docs']).delete();
			await knex('directus_fields').whereIn('collection', ['cms_ledger_collections', 'cms_ledger_docs']).delete();
		} catch (error) {
			throw new BaseException(error?.message, error?.status);
		}
	},
};
