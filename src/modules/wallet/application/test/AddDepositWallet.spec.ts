import { TransactionRepository } from '../../domain/TransactionRepository';
import { AddDepositWallet, AddDepositWalletAction } from '../AddDepositWallet';
import { mockTransactionRepo } from './mocks';
import { Currency } from '../../../core/Currency';
import { Transaction, TransactionCategory } from '../../domain/Transaction';

let transactionRepo: TransactionRepository;
let useCase: AddDepositWallet;

describe('add deposit wallet', () => {
    it('when create a deposit should create a transaction', async () => {
        const result = await useCase.execute({
            userId: 'user-123',
            amount: new Currency(1000),
        } as AddDepositWalletAction);

        expect(result).toMatchObject({
            id: 'transaction-123',
        });

        expect(transactionRepo.save).toHaveBeenCalledWith({
            userId: 'user-123',
            amount: new Currency(1000),
            category: TransactionCategory.Deposit,
            status: 'settled',
        });

        expect(transactionRepo.save).toBeCalledTimes(1);
    });

    it('when amount it is missing should fail', async () => {
        try {
            await useCase.execute({
                userId: 'user-123',
            } as AddDepositWalletAction);

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
            } as AddDepositWalletAction);

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

        useCase = new AddDepositWallet(
            transactionRepo,
        );
    });
});