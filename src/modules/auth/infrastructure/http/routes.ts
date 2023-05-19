import { AuthHandler } from './handlers/AuthHandler';

const eventHandler = new AuthHandler();

export const authRoutes = [
    {
        method: 'POST',
        path: '/auth',
        handler: eventHandler.handleAuth.bind(eventHandler),
    },
];