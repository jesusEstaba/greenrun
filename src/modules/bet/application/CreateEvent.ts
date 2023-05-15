import { UseCase } from '../../core/UseCase';
import { Event } from '../domain/Event';
import { EventRepository } from '../domain/EventRepository';

export class CreateEvent implements UseCase<CreateEventAction> {
    private eventRepository: EventRepository;

    constructor(
        eventRepository: EventRepository,
    ) {
        this.eventRepository = eventRepository;
    }

    async execute(action: CreateEventAction): Promise<Event> {
        const event = {
            ...action,
        } as Event;

        return this.eventRepository.save(event);
    }
}

export class CreateEventAction {
    constructor(
        public sport: string,
    ) {}
}