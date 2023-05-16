import { Date } from '../../core/Date';
import { Currency } from '../../core/Currency';
import { Odd } from './Odd';

export class UserBet {
    id: string;
    userId: string;
    betId: string;
    odd: Odd;
    amount: Currency;
    state: UserBetStatus;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    deleted: boolean;
}

export enum UserBetStatus {
    Lost = 'lost',
    Open = 'open',
    Won  = 'won',
}