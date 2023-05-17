/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('transactions', function (table) {
        table.increments('id').primary();

        table.string('user_id', 255).notNullable();
        table.double('amount').notNullable();
        table.string('category', 255).notNullable();
        table.string('status', 255).notNullable();
        table.string('user_bet_id', 255).nullable();

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
    return knex.schema.dropTableIfExists('transactions');
};
