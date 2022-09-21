/* eslint-disable no-irregular-whitespace, no-undef */
module.exports = {
	async up(knex) {
		await knex.schema.table('cms_queries', (table) => {
			table.text('params');
		});
		await knex.insert({
			collection: 'cms_queries',
			field: 'params',
			special: 'cast-json',
			interface: 'input',
		}).into('directus_fields');
	},
	async down(knex) {
		await knex('directus_fields').where({ collection: 'cms_queries', field: 'params' }).delete();
		await knex.schema.table('cms_queries', (table) => {
			table.dropColumn('params');
		});
	},
};
