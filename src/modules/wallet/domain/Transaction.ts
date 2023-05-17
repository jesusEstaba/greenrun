import { Currency } from '../../core/Currency';
import { Date } from '../../core/Date';

export class Transaction {
    id: string;
    userId: string;
    amount: Currency;
    category: TransactionCategory;
    status: string;
    userBetId?: string; //(if bet or winning)
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    deleted: boolean;
}

export enum TransactionCategory {
    Bet = 'bet',
    Deposit = 'deposit',
    Withdraw = 'withdraw',
    Winning = 'winning',
}

export enum TransactionStatus {
    Settled = 'settled',
}