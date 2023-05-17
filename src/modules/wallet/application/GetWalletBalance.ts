import Joi from 'joi';
import { UseCase } from '../../core/UseCase';
import { ValidationException } from '../../core/ValidationException';
import { TransactionRepository } from '../domain/TransactionRepository';
import { BuildWalletService } from './services/BuildWalletService';

export class GetWalletBalance implements UseCase<GetWalletBalanceAction>  {
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

    async execute(action: GetWalletBalanceAction): Promise<object> {
        GetWalletBalance.validation(action);

        const wallet = await this.buildWalletService.getByUserId(action.userId);

        return Promise.resolve({
            balance: wallet.getBalance().getValue(),
        });
    }

    private static validation(action: GetWalletBalanceAction) {
        const schema = Joi.object({
            userId: Joi.string().required(),
        });

        const { error } = schema.validate(action);
        if (error) {
            throw new ValidationException(error.toString());
        }
    }
}

export class GetWalletBalanceAction {
    constructor(
        public userId: string,
    ) {
    }
}