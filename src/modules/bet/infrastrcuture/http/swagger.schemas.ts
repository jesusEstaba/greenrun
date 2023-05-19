import { entityToSchema } from '../../../core/infrastructure/http/swagger/entityToSchema';
import { CreateEventAction } from '../../application/CreateEvent';
import { CreateBetAction } from '../../application/CreateBet';
import { Odd } from '../../domain/Odd';
import { PlaceBetAction } from '../../application/PlaceBet';
import { Currency } from '../../../core/Currency';
import { OptionResult, SettleEventResultAction } from '../../application/SettleEventResult';
import { BetResult, BetStatus } from '../../domain/Bet';
import { SetBetStatusAction } from '../../application/SetBetStatus';

export function createEventSchema() {
    return entityToSchema(new CreateEventAction(
        'Formula 1',
    ));
}

export function createBetSchema() {
    return entityToSchema(new CreateBetAction(
        '1',
        'hamilton',
        'event-123',
        new Odd(1),
    ));
}

export function placeBetSchema() {
    return entityToSchema(new PlaceBetAction(
        'bet-123',
        'user-123',
        new Currency(1),
    ));
}

export function settleEventResultSchema() {
    return entityToSchema(new SettleEventResultAction(
        'event-123',
        [
            new OptionResult('1', BetResult.Won),
            new OptionResult('2', BetResult.Lost),
        ],
    ));
}

export function setBetStatusSchema() {
    return entityToSchema(new SetBetStatusAction(
        'bet-123',
        BetStatus.Active,
    ));
}