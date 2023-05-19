import { WalletHandler } from './handlers/WalletHandler';
import { authMiddleware } from '../../../auth/infrastructure/http/middlewares/authMiddleware';
import { blockMiddleware } from '../../../auth/infrastructure/http/middlewares/blockMiddleware';
import { UserRepositoryImplementation } from '../../../user/infrastructure/storage/UserRepositoryImplementation';
import { addDepositSchema, withdrawSchema } from './swagger.schemas';

const handler = new WalletHandler();
const userRepository = new UserRepositoryImplementation();

export const walletRoutes = [
    {
        method: 'GET',
        path: '/wallets',
        handler: handler.handleBalance.bind(handler),
        config: {
            pre: [
                { method: authMiddleware },
                { method: blockMiddleware(userRepository) },
            ],
        },
        options: {
            tags: ['api'],
            description: 'Get Wallet balance',
        },
    },
    {
        method: 'POST',
        path: '/wallets/deposit',
        handler: handler.handleDeposit.bind(handler),
        config: {
            pre: [
                { method: authMiddleware },
                { method: blockMiddleware(userRepository) },
            ],
        },
        options: {
            tags: ['api'],
            description: 'Add Deposit to Wallet',
            validate: {
                payload: addDepositSchema(),
            },
        },
    },
    {
        method: 'POST',
        path: '/wallets/withdraw',
        handler: handler.handleWithdraw.bind(handler),
        config: {
            pre: [
                { method: authMiddleware },
                { method: blockMiddleware(userRepository) },
            ],
        },
        options: {
            tags: ['api'],
            description: 'Withdraw Wallet balance',
            validate: {
                payload: withdrawSchema(),
            },
        },
    },
];