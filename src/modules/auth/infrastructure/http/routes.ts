import { AuthHandler } from './handlers/AuthHandler';
import { loginSchema } from './swagger.schemas';

const eventHandler = new AuthHandler();

export const authRoutes = [
    {
        method: 'POST',
        path: '/auth',
        handler: eventHandler.handleAuth.bind(eventHandler),
        options: {
            tags: ['api'],
            description: 'Login',
            validate: {
                payload: loginSchema(),
            },
        },
    },
];