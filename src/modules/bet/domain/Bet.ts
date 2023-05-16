import { Date } from '../../core/Date';
import { Odd } from './Odd';

export class Bet {
    id: string;
    betOption: string;
    sport: string;
    status: BetStatus;
    name: string;
    eventId: string;
    odd: Odd;
    result?: BetResult;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    deleted: boolean;
}

export enum BetStatus {
    Active    = 'active',
    Cancelled = 'cancelled',
    Settled   = 'settled',
}

export enum BetResult {
    Lost = 'lost',
    Won  = 'won',
}