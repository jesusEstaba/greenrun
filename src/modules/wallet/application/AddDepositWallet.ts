import Joi from 'joi';
import { UseCase } from '../../core/UseCase';
import { TransactionRepository } from '../domain/TransactionRepository';
import { Currency } from '../../core/Currency';
import { ValidationException } from '../../core/ValidationException';
import { Transaction, TransactionCategory, TransactionStatus } from '../domain/Transaction';

export class AddDepositWallet implements UseCase<AddDepositWalletAction> {
    private transactionRepository: TransactionRepository;
    constructor(
        transactionRepository: TransactionRepository,
    ) {
        this.transactionRepository = transactionRepository;
    }

    async execute(action: AddDepositWalletAction): Promise<object> {
        AddDepositWallet.validation(action);
        const transaction = {
            ...action,
            category: TransactionCategory.Deposit,
            status: TransactionStatus.Settled,
        } as Transaction;

        const created = await this.transactionRepository.save(transaction);

        return Promise.resolve(created);
    }

    private static validation(action: AddDepositWalletAction) {
        const schema = Joi.object({
            userId: Joi.string().required(),
            amount: Joi.object().required(),
        });

        const { error } = schema.validate(action);
        if (error) {
            throw new ValidationException(error.toString());
        }
    }

}

export class AddDepositWalletAction {
    constructor(
        public userId: string,
        public amount: Currency,
    ) {
    }
}