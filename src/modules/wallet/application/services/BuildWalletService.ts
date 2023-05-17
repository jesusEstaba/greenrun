import { TransactionRepository } from '../../domain/TransactionRepository';
import { Wallet } from '../../domain/Wallet';

export class BuildWalletService {
    private transactionRepository: TransactionRepository;

    constructor(
        transactionRepository: TransactionRepository,
    ) {
        this.transactionRepository = transactionRepository;
    }

    async getByUserId(userId: string): Promise<Wallet> {
        const transactions = await this.transactionRepository.getByUserId(userId);

        return Promise.resolve(new Wallet(transactions));
    }
}