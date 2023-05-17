import Joi from 'joi';
import { UseCase } from '../../core/UseCase';
import { TransactionRepository } from '../domain/TransactionRepository';
import { Currency } from '../../core/Currency';
import { ValidationException } from '../../core/ValidationException';
import { Transaction, TransactionCategory, TransactionStatus } from '../domain/Transaction';
import { BuildWalletService } from './services/BuildWalletService';

export class WithdrawWallet implements UseCase<WithdrawWalletAction> {
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

    async execute(action: WithdrawWalletAction): Promise<object> {
        WithdrawWallet.validation(action);

        const wallet = await this.buildWalletService.getByUserId(action.userId);
        wallet.reduce(action.amount);

        const transaction = {
            ...action,
            category: TransactionCategory.Withdraw,
            status: TransactionStatus.Settled,
        } as Transaction;

        const created = await this.transactionRepository.save(transaction);

        return Promise.resolve(created);
    }

    private static validation(action: WithdrawWalletAction) {
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

export class WithdrawWalletAction {
    constructor(
        public userId: string,
        public amount: Currency,
    ) {
    }
}