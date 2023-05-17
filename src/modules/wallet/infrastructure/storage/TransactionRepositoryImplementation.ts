import { TransactionRepository } from '../../domain/TransactionRepository';
import { Transaction } from '../../domain/Transaction';
import { KnexRepository } from '../../../core/infrastructure/storage/KnexRepository';
import { Currency } from '../../../core/Currency';

export class TransactionRepositoryImplementation implements TransactionRepository {
    private knexRepository: KnexRepository<Transaction>;

    constructor() {
        this.knexRepository = new KnexRepository<Transaction>('transactions');
    }

    async getByUserId(userId: string): Promise<Transaction[]> {
        const transactions = await this.knexRepository.getByFields('user_id', [userId]);

        const result = transactions.map(t => {
            const { amount, ...rest } = t;

            return {
                amount: new Currency(amount as number),
                ...rest,
            } as Transaction;
        });

        return Promise.resolve(result);
    }

    async save(transaction: Transaction): Promise<Transaction> {
        const created = await this.knexRepository.save(transaction);

        return Promise.resolve(created);
    }
}