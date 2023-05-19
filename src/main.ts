import { Server } from 'hapi';
import { betRoutes } from './modules/bet/infrastructure/http/routes';
import { walletRoutes } from './modules/wallet/infrastructure/http/routes';
import { userRoutes } from './modules/user/infrastructure/http/routes';
import { authRoutes } from './modules/auth/infrastructure/http/routes';
import { ValidationException } from './modules/core/ValidationException';
import { AuthenticationException } from './modules/auth/domain/AuthenticationException';
import { PrivilegesException } from './modules/auth/domain/PrivilegesException';
import { routeExcluder } from './modules/core/infrastructure/http/routeExcluder';

const init = async function (): Promise<Server> {
    const server: Server = new Server({
        port: process.env.PORT || 4000,
        host: '0.0.0.0',
    });

    server.realm.modifiers.route.prefix = '/api/v1';

    server.route({
        method: 'GET',
        path: '/',
        handler: () => {
            return {
                message: 'Hello World!',
            };
        },
    });

    const routes = [
        betRoutes,
        walletRoutes,
        userRoutes,
        authRoutes,
    ];

    for (const routeGroup of routes) {
        server.route(
            routeExcluder(routeGroup, ['options']),
        );
    }

    server.ext('onPreResponse', (request, h) => {
        const response = request.response;

        if (response instanceof ValidationException) {
            return h.response({
                message: response.message,
            }).code(400);
        }

        if (response instanceof AuthenticationException) {
            return h.response({
                message: response.message,
            }).code(401);
        }

        if (response instanceof PrivilegesException) {
            return h.response({
                message: response.message,
            }).code(403);
        }

        if (response instanceof Error) {
            console.log({ response });

            return h.response({
                message: response.message,
            }).code(500);
        }

        return h.continue;
    });

    await server.start();

    return server;
};

process.on('unhandledRejection', (err) => {
    console.error('unhandledRejection');
    console.error(err);
    process.exit(1);
});

init()
    .then((server: Server) => {
        console.log('Server running on %s', server.info.uri);
    })
    .catch(() => {
        console.log('error on wake server');
    });