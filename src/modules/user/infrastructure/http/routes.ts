import { UserHandler } from './handlers/UserHandler';
import { blockUserSchema, createUserSchema } from './swagger.schemas';

const eventHandler = new UserHandler();

export const userRoutes = [
    {
        method: 'POST',
        path: '/users',
        handler: eventHandler.handleCreate.bind(eventHandler),
        options: {
            tags: ['api'],
            description: 'Create User',
            validate: {
                payload: createUserSchema(),
            },
        },
    },
    {
        method: 'POST',
        path: '/users/block',
        handler: eventHandler.handleBlock.bind(eventHandler),
        options: {
            tags: ['api'],
            description: 'Block User',
            validate: {
                payload: blockUserSchema(),
            },
        },
    },
];