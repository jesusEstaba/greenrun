import { EventRepository } from '../../domain/EventRepository';
import { Event } from '../../domain/Event';
import { Optional } from '../../../core/Optional';
import { KnexRepository } from '../../../core/infrastructure/storage/KnexRepository';

export class EventRepositoryImplementation implements EventRepository {
    private knexRepository: KnexRepository<Event>;

    constructor() {
        this.knexRepository = new KnexRepository<Event>('events');
    }

    async findById(id: string): Promise<Optional<Event>> {
        return this.knexRepository.findById(id);
    }

    async save(event: Event): Promise<Event> {
        return this.knexRepository.save(event);
    }
}