import { Event } from './Event';
import { Optional } from '../../core/Optional';

export interface EventRepository {
    save(event: Event): Promise<Event>;
    findById(id: string): Promise<Optional<Event>>;
}