import {Server} from "hapi";

export let server: Server;

export const init = async function(): Promise<void> {
    server = new Server({
        port: process.env.PORT || 4000,
        host: '0.0.0.0'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: () => {
            return {
                message: 'Hello World!'
            };
        }
    });

    await server.start();
};

process.on('unhandledRejection', (err) => {
    console.error("unhandledRejection");
    console.error(err);
    process.exit(1);
});

init().then(() => {
    console.log('Server running on %s', server.info.uri);
});