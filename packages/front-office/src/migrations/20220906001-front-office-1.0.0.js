/* eslint-disable no-irregular-whitespace, no-undef */
module.exports = {
	async up(knex) {
		// cms_pages
		await knex.schema.createTable('cms_pages', (table) => {
			table.increments('id');
			table.string('endpoint');
			table.string('title');
			table.boolean('hidden').defaultTo(0);
			table.integer('sort');
			table.string('key', 50).unique('key', { indexName: 'cms_pages_key_unique' });
		});

		// cms_settings
		await knex.schema.createTable('cms_settings', (table) => {
			table.increments('id');
			table.string('project_name', 50);
			table.string('project_background', 50);
			table.uuid('project_logo', 36);
			table.integer('homepage').unsigned();
			table.foreign('homepage', 'cms_settings_homepage_foreign').references('cms_pages.id').onDelete('SET NULL');
			table
				.foreign('project_logo', 'cms_settings_project_logo_foreign')
				.references('directus_files.id')
				.onDelete('SET NULL');
		});

		// cms_menus
		await knex.schema.createTable('cms_menus', (table) => {
			table.increments('id');
			table.string('label', 50);
			table.string('key', 50).unique('key', { indexName: 'cms_menus_key_unique' });
			table.text('options');
			table.string('menu', 50);
			table.integer('sort');
			table.string('icon', 50);
			table.boolean('hidden').defaultTo(0);
			table.integer('project').unsigned();
			table.integer('parent').unsigned();
			table.foreign('project', 'cms_menus_project_foreign').references('cms_settings.id').onDelete('SET NULL');
			table.foreign('parent', 'cms_menus_parent_foreign').references('cms_menus.id').onDelete('SET NULL');
		});

		// cms_queries
		await knex.schema.createTable('cms_queries', (table) => {
			table.increments('id');
			table.string('name', 50);
			table.string('key', 50).unique('key', { indexName: 'cms_queries_key_unique' });
			table.string('query');
			table.text('options');
			table.boolean('refresh_on_load');
			table.integer('timeout').defaultTo(10000);
			table.text('output');
		});

		// cms_widgets
		await knex.schema.createTable('cms_widgets', (table) => {
			table.increments('id');
			table.string('name', 50);
			table.string('key', 50).unique('key', { indexName: 'cms_widgets_key_unique' });
			table.text('options');
			table.string('widget', 50);
			table.integer('sort');
			table.string('icon', 50);
			table.boolean('hidden').defaultTo(0);
			table.text('custom_css');
			table.string('html_class');
			table.string('width', 50);
			table.integer('page').unsigned();
			table.integer('parent').unsigned();
			table.foreign('page', 'cms_widgets_page_foreign').references('cms_pages.id').onDelete('SET NULL');
			table.foreign('parent', 'cms_widgets_parent_foreign').references('cms_widgets.id').onDelete('SET NULL');
		});

		// insert into directus_collections
		const collections = [
			{
				collection: 'cms_pages',
			},
			{
				collection: 'cms_settings',
				singleton: 1,
			},
			{
				collection: 'cms_menus',
			},
			{
				collection: 'cms_queries',
			},
			{
				collection: 'cms_widgets',
			},
		];
		await knex.insert(collections).into('directus_collections');

		// insert into directus_fields
		const fields = [
			{
				collection: 'cms_settings',
				field: 'id',
				special: null,
				interface: 'input',
				options: null,
				readonly: 1,
				hidden: 1,
				sort: null,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_settings',
				field: 'project_name',
				special: null,
				interface: 'input',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: null,
				width: 'half',
				required: 0,
			},
			{
				collection: 'cms_settings',
				field: 'project_background',
				special: null,
				interface: 'select-color',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: null,
				width: 'half',
				required: 0,
			},
			{
				collection: 'cms_settings',
				field: 'project_logo',
				special: 'file',
				interface: 'file-image',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: null,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_pages',
				field: 'id',
				special: null,
				interface: 'input',
				options: null,
				readonly: 1,
				hidden: 1,
				sort: 1,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_pages',
				field: 'endpoint',
				special: null,
				interface: 'input',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: 4,
				width: 'full',
				required: 1,
			},
			{
				collection: 'cms_pages',
				field: 'title',
				special: null,
				interface: 'input',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: 2,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_pages',
				field: 'hidden',
				special: 'cast-boolean',
				interface: 'boolean',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: 5,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_settings',
				field: 'homepage',
				special: 'm2o',
				interface: 'select-dropdown-m2o',
				options: {
					template: '{{name}}',
				},
				readonly: 0,
				hidden: 0,
				sort: null,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_menus',
				field: 'id',
				special: null,
				interface: 'input',
				options: null,
				readonly: 1,
				hidden: 1,
				sort: 1,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_menus',
				field: 'label',
				special: null,
				interface: 'input',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: 4,
				width: 'full',
				required: 1,
			},
			{
				collection: 'cms_menus',
				field: 'options',
				special: 'cast-json',
				interface: 'input-code',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: 7,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_menus',
				field: 'menu',
				special: null,
				interface: 'select-dropdown',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: 6,
				width: 'full',
				required: 1,
			},
			{
				collection: 'cms_menus',
				field: 'project',
				special: 'm2o',
				interface: 'select-dropdown-m2o',
				options: {
					template: '{{project_name}}',
				},
				readonly: 0,
				hidden: 0,
				sort: 2,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_settings',
				field: 'menus',
				special: 'o2m',
				interface: 'list-o2m',
				options: {
					template: '{{label}}',
				},
				readonly: 0,
				hidden: 0,
				sort: null,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_queries',
				field: 'id',
				special: null,
				interface: 'input',
				options: null,
				readonly: 1,
				hidden: 1,
				sort: 1,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_queries',
				field: 'name',
				special: null,
				interface: 'input',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: 2,
				width: 'full',
				required: 1,
			},
			{
				collection: 'cms_queries',
				field: 'query',
				special: null,
				interface: 'select-dropdown',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: 4,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_queries',
				field: 'options',
				special: 'cast-json',
				interface: 'input-code',
				options: {
					template: '',
				},
				readonly: 0,
				hidden: 0,
				sort: 5,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_queries',
				field: 'refresh_on_load',
				special: 'cast-boolean',
				interface: 'boolean',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: 7,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_queries',
				field: 'timeout',
				special: null,
				interface: 'input',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: 8,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_widgets',
				field: 'id',
				special: null,
				interface: 'input',
				options: null,
				readonly: 1,
				hidden: 1,
				sort: 1,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_menus',
				field: 'sort',
				special: null,
				interface: 'input',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: 8,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_menus',
				field: 'icon',
				special: null,
				interface: 'input',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: 9,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_pages',
				field: 'sort',
				special: null,
				interface: 'input',
				options: null,
				readonly: 0,
				hidden: 1,
				sort: 6,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_widgets',
				field: 'name',
				special: null,
				interface: 'input',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: 2,
				width: 'full',
				required: 1,
			},
			{
				collection: 'cms_widgets',
				field: 'widget',
				special: null,
				interface: 'select-dropdown',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: 3,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_widgets',
				field: 'hidden',
				special: 'cast-boolean',
				interface: 'boolean',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: 4,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_widgets',
				field: 'sort',
				special: null,
				interface: 'input',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: 5,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_widgets',
				field: 'options',
				special: 'cast-json',
				interface: 'input-code',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: 6,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_widgets',
				field: 'width',
				special: null,
				interface: 'select-dropdown',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: 7,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_menus',
				field: 'parent',
				special: 'm2o',
				interface: 'select-dropdown-m2o',
				options: {
					template: '{{name}}',
				},
				readonly: 0,
				hidden: 0,
				sort: 10,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_menus',
				field: 'hidden',
				special: 'cast-boolean',
				interface: 'boolean',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: 11,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_widgets',
				field: 'page',
				special: 'm2o',
				interface: 'select-dropdown-m2o',
				options: {
					template: '{{name}}',
				},
				readonly: 0,
				hidden: 0,
				sort: 10,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_widgets',
				field: 'key',
				special: null,
				interface: 'input',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: 11,
				width: 'full',
				required: 1,
			},
			{
				collection: 'cms_menus',
				field: 'key',
				special: null,
				interface: 'input',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: 5,
				width: 'full',
				required: 1,
			},
			{
				collection: 'cms_pages',
				field: 'key',
				special: null,
				interface: 'input',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: 3,
				width: 'full',
				required: 1,
			},
			{
				collection: 'cms_widgets',
				field: 'parent',
				special: 'm2o',
				interface: 'select-dropdown-m2o',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: 12,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_queries',
				field: 'key',
				special: null,
				interface: 'input',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: 3,
				width: 'full',
				required: 1,
			},
			{
				collection: 'cms_widgets',
				field: 'custom_css',
				special: null,
				interface: 'input',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: 8,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_widgets',
				field: 'html_class',
				special: null,
				interface: 'input',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: 9,
				width: 'full',
				required: 0,
			},
			{
				collection: 'cms_queries',
				field: 'output',
				special: null,
				interface: 'input-code',
				options: null,
				readonly: 0,
				hidden: 0,
				sort: null,
				width: 'full',
				required: 0,
			},
		];
		await knex.insert(fields).into('directus_fields');

		// insert directus_relations
		const relations = [
			{
				many_collection: 'cms_settings',
				many_field: 'project_logo',
				one_collection: 'directus_files',
				one_field: null,
			},
			{
				many_collection: 'cms_settings',
				many_field: 'homepage',
				one_collection: 'cms_pages',
				one_field: null,
			},
			{
				many_collection: 'cms_menus',
				many_field: 'project',
				one_collection: 'cms_settings',
				one_field: 'menus',
			},
			{
				many_collection: 'cms_menus',
				many_field: 'parent',
				one_collection: 'cms_menus',
				one_field: null,
			},
			{
				many_collection: 'cms_widgets',
				many_field: 'page',
				one_collection: 'cms_pages',
				one_field: null,
			},
			{
				many_collection: 'cms_widgets',
				many_field: 'parent',
				one_collection: 'cms_widgets',
				one_field: null,
			},
		];
		await knex.insert(relations).into('directus_relations');

		await knex.insert({ id: 1, project_name: 'Front Office' }).into('cms_settings');
	},
	async down(knex) {
		await knex.schema.dropTable('cms_menus');
		await knex.schema.dropTable('cms_settings');
		await knex.schema.dropTable('cms_widgets');
		await knex.schema.dropTable('cms_queries');
		await knex.schema.dropTable('cms_pages');
		await knex('directus_collections')
			.whereIn('collection', ['cms_menus', 'cms_settings', 'cms_widgets', 'cms_queries', 'cms_pages'])
			.delete();
		await knex('directus_fields')
			.whereIn('collection', ['cms_menus', 'cms_settings', 'cms_widgets', 'cms_queries', 'cms_pages'])
			.delete();
		await knex('directus_relations').whereIn('many_collection', ['cms_menus', 'cms_settings', 'cms_widgets']).delete();
	},
};
