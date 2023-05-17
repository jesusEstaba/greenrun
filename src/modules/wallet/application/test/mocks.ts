import { TransactionRepository } from '../../domain/TransactionRepository';

export function mockTransactionRepo(): TransactionRepository {
    return {
        save: jest.fn(),
        getByUserId: jest.fn(),
    };
}