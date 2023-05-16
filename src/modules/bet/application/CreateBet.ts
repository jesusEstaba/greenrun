import Joi from 'joi';
import { BetRepository } from '../domain/BetRepository';
import { UseCase } from '../../core/UseCase';
import { Bet, BetStatus } from '../domain/Bet';
import { EventRepository } from '../domain/EventRepository';
import { Odd } from '../domain/Odd';
import { ValidationException } from '../../core/ValidationException';

export class CreateBet implements UseCase<CreateBetAction> {
    private betRepository: BetRepository;
    private eventRepository: EventRepository;

    constructor(
        betRepository: BetRepository,
        eventRepository: EventRepository,
    ) {
        this.betRepository = betRepository;
        this.eventRepository = eventRepository;
    }

    async execute(action: CreateBetAction): Promise<Bet> {
        CreateBet.validation(action);

        const eventResult = await this.eventRepository.findById(action.eventId);
        if (eventResult.isEmpty()) {
            throw new ValidationException(`Event ${action.eventId} not found`);
        }

        const { sport } = eventResult.getValue();

        const bet = {
            ...action,
            sport,
            status: BetStatus.Active,
        } as Bet;

        return this.betRepository.save(bet);
    }

    private static validation(action: CreateBetAction) {
        const schema = Joi.object({
            eventId: Joi.string().required(),
            name: Joi.string().required(),
            betOption: Joi.string().required(),
            odd: Joi.required(),
        });

        const { error } = schema.validate(action);
        if (error) {
            throw new ValidationException(error.toString());
        }
    }
}

export class CreateBetAction {
    constructor(
        public betOption: string,
        public name: string,
        public eventId: string,
        public odd: Odd,
    ) {}
}