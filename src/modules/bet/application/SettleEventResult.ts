import Joi from 'joi';
import { UseCase } from '../../core/UseCase';
import { BetRepository } from '../domain/BetRepository';
import { UserBetRepository } from '../domain/UserBetRepository';
import { ValidationException } from '../../core/ValidationException';
import { BetResult, BetStatus } from '../domain/Bet';
import { AddFunds, WalletRepository } from '../domain/WalletRepository';
import { Currency } from '../../core/Currency';
import { UserBet } from '../domain/UserBet';

export class SettleEventResult implements UseCase<SettleEventResultAction> {
    private betRepository: BetRepository;
    private userBetRepository: UserBetRepository;
    private walletRepository: WalletRepository;

    constructor(
        betRepository: BetRepository,
        userBetRepository: UserBetRepository,
        walletRepository: WalletRepository,
    ) {
        this.betRepository = betRepository;
        this.userBetRepository = userBetRepository;
        this.walletRepository = walletRepository;
    }

    async execute(action: SettleEventResultAction): Promise<unknown> {
        SettleEventResult.validation(action);
        const bets = await this.betRepository.getByEventId(action.eventId);

        if (!bets.length) {
            throw new ValidationException(`Could not found bets for the event ${action.eventId}`);
        }

        const duplicated: Record<string, number> = {};
        for (const option of action.options) {
            const found = bets.find((b) => b.betOption === option.option);
            if (!found) {
                throw new ValidationException(`Could not found option ${option.option}`);
            }

            if (found.status !== BetStatus.Active) {
                throw new ValidationException(`Could not settle option ${option.option}`);
            }

            if (duplicated[option.option]) {
                throw new ValidationException(`Option ${option.option} it is duplicated`);
            }

            duplicated[option.option] = 1;
        }

        const userBetsUpdates: UserBet[] = [];
        for (const bet of bets) {
            const option = action.options.find((o) => o.option === bet.betOption);
            bet.result = (option)
                ? option.result
                : BetResult.Lost;

            if (bet.status === BetStatus.Active) {
                bet.status = BetStatus.Settled;
            }

            userBetsUpdates.push({
                betId: bet.id,
                state: bet.result as string,
            } as UserBet);
        }

        await this.betRepository.setResults(bets);
        await this.userBetRepository.setStatesByBetId(userBetsUpdates);

        const winnerBetIds: string[] = bets.filter(b => b.result === BetResult.Won).map(b => b.id);
        const userBets = await this.userBetRepository.getByBetIds(winnerBetIds);

        const rewards = userBets.map(u => {
            const betAmount = u.amount.getValue();
            const reward = betAmount + (betAmount * u.odd.getValue());

            return new AddFunds(
                u.userId,
                new Currency(reward),
            );
        });

        if (rewards.length) {
            await this.walletRepository.addWinnersFunds(rewards);
        }

        return Promise.resolve({});
    }

    private static validation(action: SettleEventResultAction) {
        const optionSchema = Joi.object({
            option: Joi.string().required(),
            result: Joi.string().required().valid(
                BetResult.Lost,
                BetResult.Won,
            ),
        });

        const schema = Joi.object({
            eventId: Joi.string().required(),
            options: Joi.array().items(optionSchema),
        });

        const { error } = schema.validate(action);
        if (error) {
            throw new ValidationException(error.toString());
        }
    }
}

export class SettleEventResultAction {
    constructor(
        public eventId: string,
        public options: OptionResult[],
    ) {
    }
}

export class OptionResult {
    constructor(
        public option: string,
        public result: BetResult,
    ) {
    }
}