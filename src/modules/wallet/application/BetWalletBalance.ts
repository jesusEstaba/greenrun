import Joi from 'joi';
import { UseCase } from '../../core/UseCase';
import { TransactionRepository } from '../domain/TransactionRepository';
import { Currency } from '../../core/Currency';
import { ValidationException } from '../../core/ValidationException';
import { Transaction, TransactionCategory, TransactionStatus } from '../domain/Transaction';
import { BuildWalletService } from './services/BuildWalletService';

export class BetWalletBalance implements UseCase<ReduceWalletBalanceAction> {
    private readonly transactionRepository: TransactionRepository;
    private buildWalletService: BuildWalletService;
    constructor(
        transactionRepository: TransactionRepository,
    ) {
        this.transactionRepository = transactionRepository;
        this.buildWalletService = new BuildWalletService(
            this.transactionRepository,
        );
    }

    async execute(action: ReduceWalletBalanceAction): Promise<object> {
        BetWalletBalance.validation(action);

        const wallet = await this.buildWalletService.getByUserId(action.userId);
        wallet.reduce(action.amount);

        const transaction = {
            ...action,
            category: TransactionCategory.Bet,
            status: TransactionStatus.Settled,
        } as Transaction;

        const created = await this.transactionRepository.save(transaction);

        return Promise.resolve(created);
    }

    private static validation(action: ReduceWalletBalanceAction) {
        const schema = Joi.object({
            userId: Joi.string().required(),
            userBetId: Joi.string().required(),
            amount: Joi.object().required(),
        });

        const { error } = schema.validate(action);
        if (error) {
            throw new ValidationException(error.toString());
        }
    }

}

export class ReduceWalletBalanceAction {
    constructor(
        public userId: string,
        public userBetId: string,
        public amount: Currency,
    ) {
    }
}