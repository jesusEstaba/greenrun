import { Event } from './Event';

export interface EventRepository {
    save(event: Event): Event
}