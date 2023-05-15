import { EventRepository } from '../../domain/EventRepository';
import { CreateEvent, CreateEventAction } from '../CreateEvent';
import { Event } from '../../domain/Event';

const eventRepo: EventRepository = {
    save: jest.fn().mockImplementation((event: Event) => {

        return {
            ...event,
            id: 'event-123',
        } as Event;
    }),
};

const useCase = new CreateEvent(eventRepo);

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
});