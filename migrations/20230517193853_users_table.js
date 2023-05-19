/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('users', function (table) {
        table.increments('id').primary();

        table.string('role', 255).notNullable();
        table.string('first_name', 255).notNullable();
        table.string('last_name', 255).notNullable();
        table.string('phone', 255).notNullable();
        table.string('email', 255).notNullable();
        table.string('username', 255).notNullable();
        table.string('password', 255).notNullable();
        table.string('address', 255).notNullable();
        table.string('gender', 255).notNullable();
        table.string('birth_Date', 255).notNullable();
        table.string('country_id', 255).notNullable();
        table.string('city', 255).notNullable();
        table.string('category', 255).notNullable();
        table.string('document_id', 255).notNullable();
        table.string('user_state', 255).notNullable();

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
    return knex.schema.dropTableIfExists('users');
};
