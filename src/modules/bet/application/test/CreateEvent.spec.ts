import { EventRepository } from '../../domain/EventRepository';
import { CreateEvent, CreateEventAction } from '../CreateEvent';
import { Event } from '../../domain/Event';
import { eventRepoMock } from './mocks';

let eventRepo: EventRepository;
let useCase: CreateEvent;

describe('create event', () => {
    it('when create event should save a event', async () => {
        const result = await useCase.execute(new CreateEventAction(
            'Formula 1',
        ));

        expect(result).toMatchObject({
            id: 'event-123',
            sport: 'Formula 1',
        });
        expect(eventRepo.save).toBeCalledTimes(1);
    });

    beforeEach(() => {
        eventRepo = eventRepoMock();

        eventRepo.save = jest.fn().mockImplementation((event: Event) => (
            { ...event, id: 'event-123' } as Event
        ));

        useCase = new CreateEvent(eventRepo);
    });
});