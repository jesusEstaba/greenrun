import { SettleEventResult, SettleEventResultAction } from '../SettleEventResult';
import { BetRepository } from '../../domain/BetRepository';
import { Bet, BetResult, BetStatus } from '../../domain/Bet';
import { UserBetRepository } from '../../domain/UserBetRepository';
import { WalletRepository } from '../../domain/WalletRepository';
import { UserBet } from '../../domain/UserBet';
import { Currency } from '../../../core/Currency';
import { Odd } from '../../domain/Odd';
import { betRepoMock, userRepoMock, walletRepoMock } from './mocks';

let betRepo: BetRepository;
let userRepo: UserBetRepository;
let walletRepo: WalletRepository;
let useCase: SettleEventResult;

describe('settle event result', () => {
    it('when results are set should settle bets and trigger payments for winners', async () => {
        await useCase.execute({
            eventId: 'event-123',
            options: [
                { option: '1', result: BetResult.Won },
                { option: '2', result: BetResult.Lost },
            ],
        } as SettleEventResultAction);

        expect(betRepo.setResults).toHaveBeenCalledWith([
            { id: 'bet-001', betOption: '1', result: 'won', status: 'settled' },
            { id: 'bet-002', betOption: '2', result: 'lost', status: 'settled' },
            { id: 'bet-003', betOption: '3', result: 'lost', status: 'settled' },
            { id: 'bet-004', betOption: '4', result: 'lost', status: 'settled' },
        ]);

        expect(userRepo.setStatesByBetId).toHaveBeenCalledWith([
            { betId: 'bet-001', state: 'won' },
            { betId: 'bet-002', state: 'lost' },
            { betId: 'bet-003', state: 'lost' },
            { betId: 'bet-004', state: 'lost' },
        ]);

        expect(userRepo.getByBetIds).toHaveBeenCalledWith([
            'bet-001',
        ]);

        expect(walletRepo.addWinnersFunds).toHaveBeenCalledWith([
            { userId: 'user-123', amount: new Currency(2100) },
        ]);

        expect(betRepo.getByEventId).toBeCalledTimes(1);
        expect(betRepo.setResults).toBeCalledTimes(1);
        expect(userRepo.getByBetIds).toBeCalledTimes(1);
        expect(userRepo.setStatesByBetId).toBeCalledTimes(1);
        expect(walletRepo.addWinnersFunds).toBeCalledTimes(1);
    });

    it('when are not winner should only settle bets results', async () => {
        await useCase.execute({
            eventId: 'event-123',
            options: [
                { option: '1', result: BetResult.Lost },
                { option: '2', result: BetResult.Won },
            ],
        } as SettleEventResultAction);

        expect(betRepo.setResults).toHaveBeenCalledWith([
            { id: 'bet-001', betOption: '1', result: 'lost', status: 'settled' },
            { id: 'bet-002', betOption: '2', result: 'won', status: 'settled' },
            { id: 'bet-003', betOption: '3', result: 'lost', status: 'settled' },
            { id: 'bet-004', betOption: '4', result: 'lost', status: 'settled' },
        ]);

        expect(userRepo.setStatesByBetId).toHaveBeenCalledWith([
            { betId: 'bet-001', state: 'lost' },
            { betId: 'bet-002', state: 'won' },
            { betId: 'bet-003', state: 'lost' },
            { betId: 'bet-004', state: 'lost' },
        ]);

        expect(userRepo.getByBetIds).toHaveBeenCalledWith([
            'bet-002',
        ]);

        expect(betRepo.getByEventId).toBeCalledTimes(1);
        expect(betRepo.setResults).toBeCalledTimes(1);
        expect(userRepo.getByBetIds).toBeCalledTimes(1);
        expect(userRepo.setStatesByBetId).toBeCalledTimes(1);
        expect(walletRepo.addWinnersFunds).toBeCalledTimes(0);
    });

    it('when are not bets related to event should fail', async () => {
        try {
            await useCase.execute({
                eventId: 'event-404',
                options: [
                    { option: '1', result: BetResult.Won },
                ],
            } as SettleEventResultAction);

            expect(false).toBeTruthy();
        } catch (e: unknown) {
            expect(`${e.toString()}`).toEqual('Error: Could not found bets for the event event-404');
        }
    });

    it('when try to settle a non exist bet should fail', async () => {
        try {
            await useCase.execute({
                eventId: 'event-123',
                options: [
                    { option: '1', result: BetResult.Won },
                    { option: '404', result: BetResult.Won },
                ],
            } as SettleEventResultAction);

            expect(false).toBeTruthy();
        } catch (e: unknown) {
            expect(`${e.toString()}`).toEqual('Error: Could not found option 404');
        }
    });

    it('when try to settle a non active bet should fail', async () => {
        try {
            await useCase.execute({
                eventId: 'event-400',
                options: [
                    { option: '1', result: BetResult.Won },
                    { option: '2', result: BetResult.Won },
                    { option: '3', result: BetResult.Won },
                ],
            } as SettleEventResultAction);

            expect(false).toBeTruthy();
        } catch (e: unknown) {
            expect(`${e.toString()}`).toEqual('Error: Could not settle option 3');
        }
    });

    it('when has a duplicated option should fail', async () => {
        try {
            await useCase.execute({
                eventId: 'event-123',
                options: [
                    { option: '1', result: BetResult.Won },
                    { option: '1', result: BetResult.Lost },
                    { option: '3', result: BetResult.Won },
                ],
            } as SettleEventResultAction);

            expect(false).toBeTruthy();
        } catch (e: unknown) {
            expect(`${e.toString()}`).toEqual('Error: Option 1 it is duplicated');
        }
    });

    beforeEach(() => {
        betRepo = betRepoMock();
        userRepo = userRepoMock();
        walletRepo = walletRepoMock();

        betRepo.getByEventId = jest.fn().mockImplementation((eventId: string) => {
            if (eventId === 'event-404') {
                return [];
            } else if (eventId === 'event-400') {
                return [
                    { id: 'bet-001', betOption: '1', status: BetStatus.Active } as Bet,
                    { id: 'bet-002', betOption: '2', status: BetStatus.Active } as Bet,
                    { id: 'bet-003', betOption: '3', status: BetStatus.Settled } as Bet,
                ];
            }

            return [
                { id: 'bet-001', betOption: '1', status: BetStatus.Active } as Bet,
                { id: 'bet-002', betOption: '2', status: BetStatus.Active } as Bet,
                { id: 'bet-003', betOption: '3', status: BetStatus.Active } as Bet,
                { id: 'bet-004', betOption: '4', status: BetStatus.Active } as Bet,
            ];
        });

        userRepo.getByBetIds = jest.fn().mockImplementation((ids: string[]) => {
            if (ids.some(i => i === 'bet-002')) {
                return [];
            }

            return [
                { odd: new Odd(1.1), amount: new Currency(1000), userId: 'user-123' } as UserBet,
            ];
        });

        useCase = new SettleEventResult(
            betRepo,
            userRepo,
            walletRepo,
        );
    });
});