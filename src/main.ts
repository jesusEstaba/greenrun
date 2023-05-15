import { Server } from 'hapi';
import { betRoutes } from './modules/bet/infrastrcuture/http/routes';

const init = async function (): Promise<Server> {
    const server: Server = new Server({
        port: process.env.PORT || 4000,
        host: '0.0.0.0',
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: () => {
            return {
                message: 'Hello World!',
            };
        },
    });

    server.route(betRoutes);

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