import { Transaction } from './Transaction';

export interface TransactionRepository {
    save(transaction: Transaction): Promise<Transaction>
    getByUserId(userId: string): Promise<Transaction[]>
}