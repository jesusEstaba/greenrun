import { Request, ResponseToolkit, ResponseObject } from 'hapi';
import { EventRepository } from '../../../domain/EventRepository';
import { EventRepositoryImplementation } from '../../storage/EventRepositoryImplementation';
import { CreateEvent, CreateEventAction } from '../../../application/CreateEvent';

export class EventHandler {
    private readonly eventRepository: EventRepository;
    private create: CreateEvent;

    constructor() {
        this.eventRepository = new EventRepositoryImplementation();
        this.create = new CreateEvent(
            this.eventRepository,
        );
    }

    async handle(r: Request, h: ResponseToolkit): Promise<ResponseObject> {
        const action = r.payload as CreateEventAction;
        const created = await this.create.execute(action);

        return h.response(created).code(200);
    }
}