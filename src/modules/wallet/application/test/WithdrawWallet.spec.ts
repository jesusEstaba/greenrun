import { TransactionRepository } from '../../domain/TransactionRepository';
import { mockTransactionRepo } from './mocks';
import { Currency } from '../../../core/Currency';
import { Transaction, TransactionCategory } from '../../domain/Transaction';
import { WithdrawWallet, WithdrawWalletAction } from '../WithdrawWallet';

let transactionRepo: TransactionRepository;
let useCase: WithdrawWallet;

describe('withdraw wallet', () => {
    it('when make a withdraw should create a transaction', async () => {
        const result = await useCase.execute({
            userId: 'user-123',
            amount: new Currency(1000),
        } as WithdrawWalletAction);

        expect(result).toMatchObject({
            id: 'transaction-123',
        });

        expect(transactionRepo.save).toHaveBeenCalledWith({
            userId: 'user-123',
            amount: new Currency(1000),
            category: TransactionCategory.Withdraw,
            status: 'settled',
        });

        expect(transactionRepo.save).toBeCalledTimes(1);
    });

    it('when amount is above of balance should fail', async () => {
        try {
            await useCase.execute({
                userId: 'user-123',
                amount: new Currency(5000),
            } as WithdrawWalletAction);

            expect(false).toBeTruthy();
        } catch (e: unknown) {
            expect(`${e.toString()}`).toEqual(
                'Error: Insufficient balance',
            );
        }
    });

    it('when amount it is missing should fail', async () => {
        try {
            await useCase.execute({
                userId: 'user-123',
            } as WithdrawWalletAction);

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
            } as WithdrawWalletAction);

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

        useCase = new WithdrawWallet(
            transactionRepo,
        );
    });
});