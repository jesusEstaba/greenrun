import Knex, { Knex as KnexConnection } from 'knex';

function isArrayOfNumbers(arr: unknown[]): boolean {
    return Array.isArray(arr) && arr.every((item) => typeof item === 'number');
}

function camelCaseKeys(obj: object) {
    const camelCaseObj: Record<string, unknown> = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const camelCaseKey = key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
            camelCaseObj[camelCaseKey] = obj[key];
        }
    }
    return camelCaseObj;
}

export const knexDatabaseConnection: KnexConnection = Knex({
    client: 'mysql2',
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'changeit',
        database: 'greenrun',
    },
    postProcessResponse: (result: object[]) => {
        if (isArrayOfNumbers(result)) {
            return result;
        }

        if (Array.isArray(result)) {
            return result.map((row: object) => camelCaseKeys(row));
        }

        return camelCaseKeys(result as object);
    },
});