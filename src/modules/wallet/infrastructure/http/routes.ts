import { WalletHandler } from './handlers/WalletHandler';

const handler = new WalletHandler();

export const walletRoutes = [
    {
        method: 'GET',
        path: '/wallet',
        handler: handler.handleBalance.bind(handler),
    },
    {
        method: 'POST',
        path: '/wallet/deposit',
        handler: handler.handleDeposit.bind(handler),
    },
    {
        method: 'POST',
        path: '/wallet/withdraw',
        handler: handler.handleWithdraw.bind(handler),
    },
];