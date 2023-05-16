import { PlaceBet, PlaceBetAction } from '../PlaceBet';
import { BetRepository } from '../../domain/BetRepository';
import { UserBetRepository } from '../../domain/UserBetRepository';
import { WalletRepository } from '../../domain/WalletRepository';
import { Bet, BetStatus } from '../../domain/Bet';
import { UserBet } from '../../domain/UserBet';
import { Currency } from '../../../core/Currency';
import { Odd } from '../../domain/Odd';
import { Optional } from '../../../core/Optional';
import { betRepoMock, userRepoMock, walletRepoMock } from './mocks';

let betRepo: BetRepository;
let userRepo: UserBetRepository;
let walletRepo: WalletRepository;
let useCase: PlaceBet;

describe('place bet', () => {
    it('when place bet should create a user bet and debit wallet', async () => {
        const result = await useCase.execute(new PlaceBetAction(
            'bet-123',
            'user-123',
            new Currency(100),
        ));

        expect(result).toMatchObject({
            id: 'user-bet-123',
            amount: new Currency(100),
            betId: 'bet-123',
            odd: new Odd(1.1),
            userId: 'user-123',
        });
        expect(betRepo.findById).toBeCalledTimes(1);
        expect(userRepo.save).toBeCalledTimes(1);
        expect(walletRepo.discountBet).toBeCalledTimes(1);
    });

    it('when place a cancelled bet should fail', async () => {
        try {
            await useCase.execute(new PlaceBetAction(
                'bet-000',
                'user-123',
                new Currency(100),
            ));

            expect(false).toBeTruthy();
        } catch (e: unknown) {
            expect(`${e.toString()}`).toEqual('Error: Bet not has an active state');
        }
    });

    it('when place a settled bet should fail', async () => {
        try {
            await useCase.execute(new PlaceBetAction(
                'bet-111',
                'user-123',
                new Currency(100),
            ));

            expect(false).toBeTruthy();
        } catch (e: unknown) {
            expect(`${e.toString()}`).toEqual('Error: Bet not has an active state');
        }
    });

    beforeEach(() => {
        walletRepo = walletRepoMock();
        userRepo = userRepoMock();
        betRepo = betRepoMock();

        betRepo.findById = jest.fn().mockImplementation((id: string) => {
            const bet = {
                odd: new Odd(1.1),
            } as Bet;

            if (id === 'bet-123') {
                bet.status = BetStatus.Active;
            } else if (id === 'bet-000') {
                bet.status = BetStatus.Cancelled;
            } else if (id === 'bet-111') {
                bet.status = BetStatus.Settled;
            }

            return new Optional(bet);
        });
        userRepo.save = jest.fn().mockImplementation((bet: UserBet) => (
            { ...bet, id: 'user-bet-123' } as UserBet
        ));

        useCase = new PlaceBet(
            walletRepo,
            betRepo,
            userRepo,
        );
    });
});