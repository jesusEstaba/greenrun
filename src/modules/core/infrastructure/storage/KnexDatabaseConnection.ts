import Knex, { Knex as KnexConnection } from 'knex';

export const knexDatabaseConnection: KnexConnection = Knex({
    client: 'mysql2',
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'changeit',
        database: 'greenrun',
    },
});