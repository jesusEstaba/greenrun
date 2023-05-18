import { UserHandler } from './handlers/UserHandler';

const eventHandler = new UserHandler();

export const userRoutes = [
    {
        method: 'POST',
        path: '/users',
        handler: eventHandler.handleCreate.bind(eventHandler),
    },
    {
        method: 'POST',
        path: '/users/block',
        handler: eventHandler.handleBlock.bind(eventHandler),
    },
];