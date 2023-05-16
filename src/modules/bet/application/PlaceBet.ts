import Joi from 'joi';
import { BetRepository } from '../domain/BetRepository';
import { UserBetRepository } from '../domain/UserBetRepository';
import { Currency } from '../../core/Currency';
import { UserBet, UserBetStatus } from '../domain/UserBet';
import { Bet, BetStatus } from '../domain/Bet';
import { WalletRepository } from '../domain/WalletRepository';
import { Optional } from '../../core/Optional';
import { ValidationException } from '../../core/ValidationException';

export class PlaceBet {
    private walletRepository: WalletRepository;
    private betRepository: BetRepository;
    private userBetRepository: UserBetRepository;

    constructor(
        walletRepository: WalletRepository,
        betRepository: BetRepository,
        userBetRepository: UserBetRepository,
    ) {
        this.walletRepository = walletRepository;
        this.betRepository = betRepository;
        this.userBetRepository = userBetRepository;
    }

    async execute(action: PlaceBetAction): Promise<UserBet> {
        PlaceBet.validation(action);

        const betResult: Optional<Bet> = await this.betRepository.findById(action.betId);
        if (betResult.isEmpty()) {
            throw new ValidationException(`Bet ${action.betId} not found`);
        }

        const { odd, status } = betResult.getValue();
        if (status !== BetStatus.Active) {
            throw new ValidationException('Bet not has an active state');
        }

        const userBet = {
            ...action,
            odd,
            state: UserBetStatus.Open,
        } as UserBet;

        const createdUserBet = await this.userBetRepository.save(userBet);
        await this.walletRepository.discountBet(userBet.userId, userBet.amount);

        return createdUserBet;
    }

    private static validation(action: PlaceBetAction) {
        const schema = Joi.object({
            betId: Joi.string().required(),
            userId: Joi.string().required(),
            amount: Joi.required(),
        });

        const { error } = schema.validate(action);
        if (error) {
            throw new ValidationException(error.toString());
        }
    }
}

export class PlaceBetAction {
    constructor(
        public betId: string,
        public userId: string,
        public amount: Currency,
    ) {}
}