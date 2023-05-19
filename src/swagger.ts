import { Server, ServerRegisterPluginObject, Plugin } from 'hapi';
import * as Inert from 'inert';
import * as Vision from 'vision';
import * as HapiSwaggered from 'hapi-swaggered';
import * as HapiSwaggeredUI from 'hapi-swaggered-ui';
import { betRoutes } from './modules/bet/infrastrcuture/http/routes';
import { walletRoutes } from './modules/wallet/infrastructure/http/routes';
import { userRoutes } from './modules/user/infrastructure/http/routes';
import { authRoutes } from './modules/auth/infrastructure/http/routes';
import { routeExcluder } from './modules/core/infrastructure/http/RouteExcluder';

const server = new Server({
    port: 3000,
    host: 'localhost',
});

const init = async () => {
    await server.register([Inert, Vision]);
    const swaggerOptions: HapiSwaggered.RegisterOptions = {
        info: {
            title: 'GreenRun API Documentation',
            version: '1.0.0',
        },
        tags: [
            { name: 'bets', description: 'Bets' },
            { name: 'events', description: 'Events' },
            { name: 'wallets', description: 'Wallets' },
            { name: 'auth', description: 'Authentication' },
            { name: 'users', description: 'Users' },
        ],
    };

    await server.register({
        plugin: HapiSwaggered as Plugin<object>,
        options: swaggerOptions as object,
    } as ServerRegisterPluginObject<object>);

    await server.register({
        plugin: HapiSwaggeredUI as Plugin<object>,
        options: {
            title: 'Swagger UI',
            path: '/docs',
            swaggerOptions: {
                validatorUrl: null,
            },
        } as object,
    } as ServerRegisterPluginObject<object>);

    server.route(routeExcluder(betRoutes, ['config']));
    server.route(routeExcluder(walletRoutes, ['config']));
    server.route(routeExcluder(userRoutes, ['config']));
    server.route(routeExcluder(authRoutes, ['config']));

    await server.start();

};

init().then(() => {
    console.log('Swagger server started');
}).catch(() => {
    console.log('Fail to start swagger server');
});