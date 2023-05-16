/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('bets', function (table) {
        table.increments('id').primary();
        table.string('bet_option', 255).notNullable();
        table.string('sport', 255).notNullable();
        table.string('status', 255).notNullable();
        table.string('name', 255).notNullable();
        table.string('event_id', 255).notNullable();
        table.float('odd').notNullable();
        table.string('result', 255).nullable();

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
    return knex.schema.dropTableIfExists('bets');
};
