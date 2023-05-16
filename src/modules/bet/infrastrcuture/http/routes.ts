import { EventHandler } from './handlers/EventHandler';
import { BetHandler } from './handlers/BetHandler';

const eventHandler = new EventHandler();
const betHandler = new BetHandler();

export const betRoutes = [
    {
        method: 'POST',
        path: '/events',
        handler: eventHandler.handle.bind(eventHandler),
    },
    {
        method: 'POST',
        path: '/bet',
        handler: betHandler.handleCreate.bind(betHandler),
    },
    {
        method: 'POST',
        path: '/bet/place',
        handler: betHandler.handlePlace.bind(betHandler),
    },
    {
        method: 'POST',
        path: '/bet/settle',
        handler: betHandler.handleSettle.bind(betHandler),
    },
];