import Joi from 'joi';
import { UseCase } from '../../core/UseCase';
import { ValidationException } from '../../core/ValidationException';
import { Bet, BetStatus } from '../domain/Bet';
import { BetRepository } from '../domain/BetRepository';
import { Optional } from '../../core/Optional';

export class SetBetStatus implements UseCase<SetBetStatusAction> {
    private betRepository: BetRepository;

    constructor(
        betRepository: BetRepository,
    ) {
        this.betRepository = betRepository;
    }

    async execute(action: SetBetStatusAction): Promise<object> {
        SetBetStatus.validation(action);
        const betResult: Optional<Bet> = await this.betRepository.findById(action.betId);
        if (betResult.isEmpty()) {
            throw new ValidationException(`Bet ${action.betId} not found`);
        }

        const bet = betResult.getValue();
        bet.status = action.status as BetStatus;

        await this.betRepository.updateState(bet);

        return Promise.resolve({});
    }


    private static validation(action: SetBetStatusAction) {
        const schema = Joi.object({
            betId: Joi.string().required(),
            status: Joi.string().required().valid(
                BetStatus.Active,
                BetStatus.Cancelled,
            ),
        });

        const { error } = schema.validate(action);
        if (error) {
            throw new ValidationException(error.toString());
        }
    }
}

export class SetBetStatusAction {
    constructor(
        public betId: string,
        public status: string,
    ) {}
}