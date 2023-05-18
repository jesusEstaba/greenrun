import { Optional } from '../../Optional';
import { knexDatabaseConnection } from './KnexDatabaseConnection';
import { EntityToStorableConverter } from '../EntityToStorableConverter';
import { Knex } from 'knex';
import Transaction = Knex.Transaction;

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

    async getByFieldOr(where: Record<string, unknown>): Promise<T[]> {
        const entries = Object.entries(where);
        const queryBuilder = knexDatabaseConnection(this.tableName);

        for (const [key, val] of entries) {
            await queryBuilder.orWhere(key, val);
        }

        const result: T[] = await queryBuilder.select('*') as T[];
        return result;
    }

    async getByFields(key: string, values: unknown[]): Promise<Record<string, unknown>[]> {
        const result: Record<string, unknown>[] = await knexDatabaseConnection(this.tableName)
            .whereIn(key, values)
            .select('*') as Record<string, unknown>[];

        return Promise.resolve(result);
    }

    async save(obj: T): Promise<T> {
        const entity: Record<string, unknown> = EntityToStorableConverter.convert({ ...obj } as Record<string, unknown>);

        const [id]: number[] = await knexDatabaseConnection(this.tableName)
            .insert({
                ...entity,
            }) as number[];

        const [result]: T[] = await knexDatabaseConnection(this.tableName)
            .where({ id })
            .select('*') as T[];

        return Promise.resolve(result);
    }

    async updateFieldsById(id: string, fields: object): Promise<T> {
        await knexDatabaseConnection(this.tableName)
            .where('id', id)
            .update({
                ...fields,
                updated_at: KnexRepository.now(),
            });

        const [result]: T[] = await knexDatabaseConnection(this.tableName)
            .where({ id })
            .select('*') as T[];

        return Promise.resolve(result);
    }

    async updateFieldsByKeyIn(key: string, items: string[], fields: object): Promise<void> {
        await knexDatabaseConnection(this.tableName)
            .whereIn(key, items)
            .update({
                ...fields,
                updated_at: KnexRepository.now(),
            });

        return;
    }

    async updateManyByKey(key: string, updates: object[]): Promise<void> {
        await knexDatabaseConnection.transaction(async (trx: Transaction) => {
            const queries = updates.map((u) => {
                const { ...fields } = u;
                const id = (u as { id: string }).id;

                return trx(this.tableName).where(key, id).update({
                    ...fields,
                    updated_at: KnexRepository.now(),
                });
            });

            await Promise.all(queries);
        });

        return;
    }

    private static now(): string {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}