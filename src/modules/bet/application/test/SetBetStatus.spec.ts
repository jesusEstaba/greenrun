import { SetBetStatus, SetBetStatusAction } from '../SetBetStatus';
import { BetRepository } from '../../domain/BetRepository';
import { betRepoMock } from './mocks';
import { Optional } from '../../../core/Optional';
import { Bet } from '../../domain/Bet';

let betRepo: BetRepository;
let useCase: SetBetStatus;

describe('set bet status', () => {
    it('when bet is cancelled should update state to active', async () => {
        await useCase.execute({
            betId: 'bet-123',
            status: 'active',
        } as SetBetStatusAction);

        expect(betRepo.updateState).toHaveBeenCalledWith({
            status: 'active',
        });

        expect(betRepo.findById).toBeCalledTimes(1);
        expect(betRepo.updateState).toBeCalledTimes(1);
    });

    it('when bet does not exist should fail', async () => {
        try {
            await useCase.execute({
                betId: 'bet-404',
                status: 'active',
            } as SetBetStatusAction);
            expect(false).toBeTruthy();
        } catch (e: unknown) {
            expect(`${e.toString()}`).toEqual(
                'Error: Bet bet-404 not found',
            );
        }
    });

    it('when status is settle should fail', async () => {
        try {
            await useCase.execute({
                betId: 'bet-123',
                status: 'settle',
            } as SetBetStatusAction);
            expect(false).toBeTruthy();
        } catch (e: unknown) {
            expect(`${e.toString()}`).toEqual(
                'Error: ValidationError: \"status\" must be one of [active, cancelled]',
            );
        }
    });

    beforeEach(() => {
        betRepo = betRepoMock();
        betRepo.findById = jest.fn().mockImplementation((id: string) => (
            id === 'bet-123'
                ? new Optional({ status: 'cancelled' } as Bet)
                : new Optional(undefined)
        ));

        useCase = new SetBetStatus(
            betRepo,
        );
    });
});