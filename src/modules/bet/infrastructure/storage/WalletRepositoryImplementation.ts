import { AddFunds, WalletRepository } from '../../domain/WalletRepository';
import { Currency } from '../../../core/Currency';

export class WalletRepositoryImplementation implements WalletRepository {
    async discountBet(userId: string, amount: Currency): Promise<void> {
        console.log({ userId, amount });

        return;
    }

    async addWinnersFunds(transactions: AddFunds[]): Promise<void> {
        console.log({ transactions });

        return;
    }
}