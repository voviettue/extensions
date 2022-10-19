/* eslint-disable no-irregular-whitespace, no-undef */
module.exports = {
	async up(knex) {
		await knex.schema.table('cms_pages', (table) => {
			table.text('options');
		});

		await knex.schema.table('cms_settings', (table) => {
			table.text('options');
			table.text('menu_options');
			table.text('page_options');
		});

		await knex.insert({
			collection: 'cms_pages',
			field: 'options',
			special: 'cast-json',
			interface: 'input',
		}).into('directus_fields');

		await knex.insert({
			collection: 'cms_settings',
			field: 'options',
			special: 'cast-json',
			interface: 'input',
		}).into('directus_fields');

		await knex.insert({
			collection: 'cms_settings',
			field: 'menu_options',
			special: 'cast-json',
			interface: 'input',
		}).into('directus_fields');

		await knex.insert({
			collection: 'cms_settings',
			field: 'page_options',
			special: 'cast-json',
			interface: 'input',
		}).into('directus_fields');
	},
	async down(knex) {
		await knex('directus_fields').where({ collection: 'cms_settings', field: 'options' }).delete();
		await knex('directus_fields').where({ collection: 'cms_settings', field: 'menu_options' }).delete();
		await knex('directus_fields').where({ collection: 'cms_settings', field: 'page_options' }).delete();
		await knex('directus_fields').where({ collection: 'cms_pages', field: 'options' }).delete();

		await knex.schema.table('cms_settings', (table) => {
			table.dropColumn('options');
			table.dropColumn('menu_options');
			table.dropColumn('page_options');
		});

		await knex.schema.table('cms_pages', (table) => {
			table.dropColumn('options');
		});
	},
};
