import { knexDatabaseConnection } from '../../../core/infrastructure/storage/KnexDatabaseConnection';
import { EventRepository } from '../../domain/EventRepository';
import { Event } from '../../domain/Event';

export class EventRepositoryImplementation implements EventRepository {
    async save(event: Event): Promise<Event> {
        const [id]: number[] = await knexDatabaseConnection('events')
            .insert({
                ...event,
            }) as number[];

        const [result]: Event[] = await knexDatabaseConnection('events')
            .where({ id })
            .select('*') as Event[];

        return Promise.resolve(result);
    }
}