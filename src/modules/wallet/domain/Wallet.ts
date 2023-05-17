import { Currency } from '../../core/Currency';
import { Transaction, TransactionCategory } from './Transaction';
import { ValidationException } from '../../core/ValidationException';

export class Wallet {
    private readonly transactions: Transaction[];

    constructor(transactions: Transaction[]) {
        this.transactions = transactions;
    }

    private isAdditionCategory(category: TransactionCategory): boolean {
        const addTypes = [
            TransactionCategory.Deposit,
            TransactionCategory.Winning,
        ];

        return addTypes.some(c => c == category);
    }

    getBalance(): Currency {
        let balance = 0;

        for (const t of this.transactions) {
            if (this.isAdditionCategory(t.category)) {
                balance += t.amount.getValue();
            } else {
                balance -= t.amount.getValue();
            }
        }

        if (balance < 0) {
            throw new ValidationException('Balance conflict');
        }

        return new Currency(balance);
    }

    reduce(amount: Currency): void {
        if (amount.getValue() > this.getBalance().getValue()) {
            throw new ValidationException('Insufficient balance');
        }
    }
}