import { EventRepository } from '../../domain/EventRepository';
import { Event } from '../../domain/Event';
import { Bet } from '../../domain/Bet';
import { BetRepository } from '../../domain/BetRepository';
import { CreateBet, CreateBetAction } from '../CreateBet';
import { Optional } from '../../../core/Optional';
import { Odd } from '../../domain/Odd';
import { betRepoMock, eventRepoMock } from './mocks';

let useCase: CreateBet;
let eventRepo: EventRepository;
let betRepo: BetRepository;

describe('create bet', () => {
    it('when create bet should save a bet', async () => {
        const result = await useCase.execute({
            betOption: '1',
            name: 'Lewis Hamilton',
            eventId: 'event-123',
            odd: new Odd(1.1),
        } as CreateBetAction);

        expect(result).toMatchObject({
            id: 'bet-123',
            sport: 'Formula 1',
            betOption: '1',
            name: 'Lewis Hamilton',
            eventId: 'event-123',
            odd: new Odd(1.1),
        });

        expect(eventRepo.findById).toBeCalledTimes(1);
        expect(betRepo.save).toBeCalledTimes(1);
    });

    it('when event id does not exist should fail', async () => {
        try {
            await useCase.execute({
                betOption: '1',
                name: 'Lewis Hamilton',
                eventId: 'event-404',
                odd: new Odd(1.1),
            } as CreateBetAction);
            expect(false).toBeTruthy();
        } catch (e: unknown) {
            expect(`${e.toString()}`).toEqual('Error: Event event-404 not found');
        }

        expect(eventRepo.findById).toBeCalledTimes(1);
        expect(betRepo.save).toBeCalledTimes(0);
    });

    beforeEach(() => {
        eventRepo = eventRepoMock();
        betRepo = betRepoMock();

        eventRepo.findById = jest.fn().mockImplementation((id: string) => {
            return id === 'event-123'
                ? new Optional({ sport: 'Formula 1' } as Event)
                : new Optional(undefined);
        });

        betRepo.save = jest.fn().mockImplementation((bet: Bet) => (
            { ...bet, id: 'bet-123' } as Bet
        ));

        useCase = new CreateBet(
            betRepo,
            eventRepo,
        );
    });
});