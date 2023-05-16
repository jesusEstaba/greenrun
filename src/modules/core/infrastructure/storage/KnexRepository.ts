import { Optional } from '../../Optional';
import { knexDatabaseConnection } from './KnexDatabaseConnection';
import { EntityToStorableConverter } from '../EntityToStorableConverter';

export class KnexRepository<T> {
    private tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    async findById(id: string): Promise<Optional<T>> {
        const [result]: T[] = await knexDatabaseConnection(this.tableName)
            .where({ id })
            .select('*') as T[];

        return Promise.resolve(new Optional(result));
    }

    async getByField(where: Record<string, unknown>): Promise<T[]> {
        const result: T[] = await knexDatabaseConnection(this.tableName)
            .where({ ...where })
            .select('*') as T[];

        return Promise.resolve(result);
    }

    async getByFields(key: string, values: unknown[]): Promise<Record<string, unknown>[]> {
        const result: Record<string, unknown>[] = await knexDatabaseConnection(this.tableName)
            .whereIn(key, values)
            .select('*') as Record<string, unknown>[];

        return Promise.resolve(result);
    }

    async save(bet: T): Promise<T> {
        const entity: Record<string, unknown> = EntityToStorableConverter.convert({ ...bet } as Record<string, unknown>);

        const [id]: number[] = await knexDatabaseConnection(this.tableName)
            .insert({
                ...entity,
            }) as number[];

        const [result]: T[] = await knexDatabaseConnection(this.tableName)
            .where({ id })
            .select('*') as T[];

        return Promise.resolve(result);
    }
}