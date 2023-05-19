import { EventHandler } from './handlers/EventHandler';
import { BetHandler } from './handlers/BetHandler';
import { authMiddleware } from '../../../auth/infrastructure/http/middlewares/authMiddleware';
import { adminMiddleware } from '../../../auth/infrastructure/http/middlewares/adminMiddleware';
import { UserRepositoryImplementation } from '../../../user/infrastructure/storage/UserRepositoryImplementation';
import { blockMiddleware } from '../../../auth/infrastructure/http/middlewares/blockMiddleware';
import {
    createEventSchema,
    createBetSchema,
    placeBetSchema,
    settleEventResultSchema,
    setBetStatusSchema,
} from './swagger.schemas';

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
        options: {
            tags: ['api'],
            description: 'Create Event',
            validate: {
                payload: createEventSchema(),
            },
        },
    },
    {
        method: 'POST',
        path: '/bets',
        handler: betHandler.handleCreate.bind(betHandler),
        config: {
            pre: [
                { method: authMiddleware },
                { method: adminMiddleware },
                { method: blockMiddleware(userRepository) },
            ],
        },
        options: {
            tags: ['api'],
            description: 'Create Bet',
            validate: {
                payload: createBetSchema(),
            },
        },
    },
    {
        method: 'POST',
        path: '/bets/place',
        handler: betHandler.handlePlace.bind(betHandler),
        config: {
            pre: [
                { method: authMiddleware },
                { method: blockMiddleware(userRepository) },
            ],
        },
        options: {
            tags: ['api'],
            description: 'Place Bet',
            validate: {
                payload: placeBetSchema(),
            },
        },
    },
    {
        method: 'POST',
        path: '/bets/settle',
        handler: betHandler.handleSettle.bind(betHandler),
        config: {
            pre: [
                { method: authMiddleware },
                { method: adminMiddleware },
                { method: blockMiddleware(userRepository) },
            ],
        },
        options: {
            tags: ['api'],
            description: 'Settle Event results',
            validate: {
                payload: settleEventResultSchema(),
            },
        },
    },
    {
        method: 'POST',
        path: '/bets/status',
        handler: betHandler.handleState.bind(betHandler),
        config: {
            pre: [
                { method: authMiddleware },
                { method: adminMiddleware },
                { method: blockMiddleware(userRepository) },
            ],
        },
        options: {
            tags: ['api'],
            description: 'Set Bet status',
            validate: {
                payload: setBetStatusSchema(),
            },
        },
    },
];