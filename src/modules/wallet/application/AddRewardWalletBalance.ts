import Joi from 'joi';
import { UseCase } from '../../core/UseCase';
import { TransactionRepository } from '../domain/TransactionRepository';
import { Currency } from '../../core/Currency';
import { ValidationException } from '../../core/ValidationException';
import { Transaction, TransactionCategory, TransactionStatus } from '../domain/Transaction';

export class AddRewardWalletBalance implements UseCase<AddRewardWalletBalanceAction> {
    private transactionRepository: TransactionRepository;
    constructor(
        transactionRepository: TransactionRepository,
    ) {
        this.transactionRepository = transactionRepository;
    }

    async execute(action: AddRewardWalletBalanceAction): Promise<object> {
        AddRewardWalletBalance.validation(action);
        const transaction = {
            ...action,
            category: TransactionCategory.Winning,
            status: TransactionStatus.Settled,
        } as Transaction;

        const created = await this.transactionRepository.save(transaction);

        return Promise.resolve(created);
    }

    private static validation(action: AddRewardWalletBalanceAction) {
        const schema = Joi.object({
            userId: Joi.string().required(),
            amount: Joi.object().required(),
            userBetId: Joi.string().required(),
        });

        const { error } = schema.validate(action);
        if (error) {
            throw new ValidationException(error.toString());
        }
    }

}

export class AddRewardWalletBalanceAction {
    constructor(
        public userId: string,
        public userBetId: string,
        public amount: Currency,
    ) {
    }
}