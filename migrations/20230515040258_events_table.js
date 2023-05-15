/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('events', function (table) {
        table.increments('id').primary();
        table.string('sport', 255).notNullable();
        table.boolean('deleted').notNullable().defaultTo(false);
        table.timestamp('deleted_at').nullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('events');
};
