import { WalletHandler } from './handlers/WalletHandler';
import { authMiddleware } from '../../../auth/infrastructure/http/middlewares/authMiddleware';
import { blockMiddleware } from '../../../auth/infrastructure/http/middlewares/blockMiddleware';
import { UserRepositoryImplementation } from '../../../user/infrastructure/storage/UserRepositoryImplementation';

const handler = new WalletHandler();
const userRepository = new UserRepositoryImplementation();

export const walletRoutes = [
    {
        method: 'GET',
        path: '/wallet',
        handler: handler.handleBalance.bind(handler),
        config: {
            pre: [
                { method: authMiddleware },
                { method: blockMiddleware(userRepository) },
            ],
        },
    },
    {
        method: 'POST',
        path: '/wallet/deposit',
        handler: handler.handleDeposit.bind(handler),
        config: {
            pre: [
                { method: authMiddleware },
                { method: blockMiddleware(userRepository) },
            ],
        },
    },
    {
        method: 'POST',
        path: '/wallet/withdraw',
        handler: handler.handleWithdraw.bind(handler),
        config: {
            pre: [
                { method: authMiddleware },
                { method: blockMiddleware(userRepository) },
            ],
        },
    },
];