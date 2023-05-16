import { Currency } from '../../core/Currency';

export interface WalletRepository {
    discountBet(userId: string, amount: Currency): Promise<void>
    addWinnersFunds(transactions: AddFunds[]): Promise<void>
}

export class AddFunds {
    constructor(
        public userId: string,
        public amount: Currency,
    ) {
    }
}