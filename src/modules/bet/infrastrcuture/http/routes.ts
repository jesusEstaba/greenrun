import { EventHandler } from './handlers/EventHandler';

const eventHandler = new EventHandler();

export const betRoutes = [
    {
        method: 'POST',
        path: '/events',
        handler: eventHandler.handle.bind(eventHandler),
    },
];