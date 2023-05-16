/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('user_bets', function (table) {
        table.increments('id').primary();

        table.string('state', 255).notNullable();
        table.string('bet_id', 255).notNullable();
        table.string('user_id', 255).notNullable();
        table.float('odd').notNullable();
        table.double('amount').notNullable();

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
    return knex.schema.dropTableIfExists('user_bets');
};
