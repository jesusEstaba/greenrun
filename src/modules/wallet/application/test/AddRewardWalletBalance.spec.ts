import { TransactionRepository } from '../../domain/TransactionRepository';
import { mockTransactionRepo } from './mocks';
import { Currency } from '../../../core/Currency';
import { Transaction, TransactionCategory } from '../../domain/Transaction';
import { AddRewardWalletBalance, AddRewardWalletBalanceAction } from '../AddRewardWalletBalance';

let transactionRepo: TransactionRepository;
let useCase: AddRewardWalletBalance;

describe('add reward wallet balance', () => {
    it('when create a deposit should create a transaction', async () => {
        const result = await useCase.execute({
            userId: 'user-123',
            amount: new Currency(1000),
            userBetId: 'user-bet-123',
        } as AddRewardWalletBalanceAction);

        expect(result).toMatchObject({
            id: 'transaction-123',
        });

        expect(transactionRepo.save).toHaveBeenCalledWith({
            userId: 'user-123',
            amount: new Currency(1000),
            category: TransactionCategory.Winning,
            userBetId: 'user-bet-123',
            status: 'settled',
        });

        expect(transactionRepo.save).toBeCalledTimes(1);
    });

    it('when amount it is missing should fail', async () => {
        try {
            await useCase.execute({
                userId: 'user-123',
                userBetId: 'user-bet-123',
            } as AddRewardWalletBalanceAction);

            expect(false).toBeTruthy();
        } catch (e: unknown) {
            expect(`${e.toString()}`).toEqual(
                'Error: ValidationError: \"amount\" is required',
            );
        }
    });

    it('when userId it is missing should fail', async () => {
        try {
            await useCase.execute({
                amount: new Currency(1000),
                userBetId: 'user-bet-123',
            } as AddRewardWalletBalanceAction);

            expect(false).toBeTruthy();
        } catch (e: unknown) {
            expect(`${e.toString()}`).toEqual(
                'Error: ValidationError: \"userId\" is required',
            );
        }
    });

    it('when userBetId it is missing should fail', async () => {
        try {
            await useCase.execute({
                userId: 'user-123',
                amount: new Currency(1000),
            } as AddRewardWalletBalanceAction);

            expect(false).toBeTruthy();
        } catch (e: unknown) {
            expect(`${e.toString()}`).toEqual(
                'Error: ValidationError: \"userBetId\" is required',
            );
        }
    });

    beforeEach(() => {
        transactionRepo = mockTransactionRepo();
        transactionRepo.save = jest.fn().mockImplementation((t: Transaction) => (
            { ...t, id: 'transaction-123' } as Transaction
        ));

        useCase = new AddRewardWalletBalance(
            transactionRepo,
        );
    });
});