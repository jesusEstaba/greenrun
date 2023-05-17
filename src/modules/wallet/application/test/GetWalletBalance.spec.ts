import { TransactionRepository } from '../../domain/TransactionRepository';
import { mockTransactionRepo } from './mocks';
import { Currency } from '../../../core/Currency';
import { Transaction, TransactionCategory } from '../../domain/Transaction';
import { GetWalletBalance, GetWalletBalanceAction } from '../GetWalletBalance';

let transactionRepo: TransactionRepository;
let useCase: GetWalletBalance;

describe('get wallet balance', () => {
    it('when request user wallet should get balance', async () => {
        const result = await useCase.execute({
            userId: 'user-123',
        } as GetWalletBalanceAction);

        expect(result).toMatchObject({
            balance: 2000,
        });
    });

    it('when userId it is missing should fail', async () => {
        try {
            await useCase.execute({} as GetWalletBalanceAction);

            expect(false).toBeTruthy();
        } catch (e: unknown) {
            expect(`${e.toString()}`).toEqual(
                'Error: ValidationError: \"userId\" is required',
            );
        }
    });

    beforeEach(() => {
        transactionRepo = mockTransactionRepo();
        transactionRepo.save = jest.fn().mockImplementation((t: Transaction) => (
            { ...t, id: 'transaction-123' } as Transaction
        ));
        transactionRepo.getByUserId = jest.fn().mockImplementation(() => (
            [
                { amount: new Currency(2000), category: TransactionCategory.Deposit } as Transaction,
            ]
        ));

        useCase = new GetWalletBalance(
            transactionRepo,
        );
    });
});