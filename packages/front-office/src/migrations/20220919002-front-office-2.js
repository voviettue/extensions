/* eslint-disable no-irregular-whitespace, no-undef */
module.exports = {
	async up(knex) {
		await knex.schema.table('cms_widgets', (table) => {
			table.dropForeign('parent');
			table.dropForeign('page');
			table.foreign('parent').references('cms_widgets.id').onDelete('CASCADE');
			table.foreign('page').references('cms_pages.id').onDelete('CASCADE');
		});
		await knex.schema.table('cms_menus', (table) => {
			table.dropForeign('parent');
			table.foreign('parent').references('cms_menus.id').onDelete('CASCADE');
		});
	},
	async down(knex) {
		await knex.schema.table('cms_widgets', (table) => {
			table.dropForeign('parent');
			table.dropForeign('page');
			table.foreign('parent').references('cms_widgets.id').onDelete('SET NULL');
			table.foreign('page').references('cms_pages.id').onDelete('SET NULL');
		});
		await knex.schema.table('cms_menus', (table) => {
			table.dropForeign('parent');
			table.foreign('parent').references('cms_menus.id').onDelete('SET NULL');
		});
	},
};
