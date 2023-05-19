import { EventHandler } from './handlers/EventHandler';
import { BetHandler } from './handlers/BetHandler';
import { authMiddleware } from '../../../auth/infrastructure/http/middlewares/authMiddleware';
import { adminMiddleware } from '../../../auth/infrastructure/http/middlewares/adminMiddleware';
import { UserRepositoryImplementation } from '../../../user/infrastructure/storage/UserRepositoryImplementation';
import { blockMiddleware } from '../../../auth/infrastructure/http/middlewares/blockMiddleware';

const eventHandler = new EventHandler();
const betHandler = new BetHandler();
const userRepository = new UserRepositoryImplementation();

export const betRoutes = [
    {
        method: 'POST',
        path: '/events',
        handler: eventHandler.handle.bind(eventHandler),
        config: {
            pre: [
                { method: authMiddleware },
                { method: adminMiddleware },
                { method: blockMiddleware(userRepository) },
            ],
        },
    },
    {
        method: 'POST',
        path: '/bet',
        handler: betHandler.handleCreate.bind(betHandler),
        config: {
            pre: [
                { method: authMiddleware },
                { method: adminMiddleware },
                { method: blockMiddleware(userRepository) },
            ],
        },
    },
    {
        method: 'POST',
        path: '/bet/place',
        handler: betHandler.handlePlace.bind(betHandler),
        config: {
            pre: [
                { method: authMiddleware },
                { method: blockMiddleware(userRepository) },
            ],
        },
    },
    {
        method: 'POST',
        path: '/bet/settle',
        handler: betHandler.handleSettle.bind(betHandler),
        config: {
            pre: [
                { method: authMiddleware },
                { method: adminMiddleware },
                { method: blockMiddleware(userRepository) },
            ],
        },
    },
    {
        method: 'POST',
        path: '/bet/status',
        handler: betHandler.handleState.bind(betHandler),
        config: {
            pre: [
                { method: authMiddleware },
                { method: adminMiddleware },
                { method: blockMiddleware(userRepository) },
            ],
        },
    },
];