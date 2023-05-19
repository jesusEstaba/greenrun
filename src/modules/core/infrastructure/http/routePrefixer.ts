import { ServerRoute } from 'hapi';

export function routePrefixer(routes: ServerRoute[], prefix: string) {
    return routes.map(r => {
        const route = {} as ServerRoute;
        for (const key of Object.keys(r)) {
            if (key === 'path') {
                route[key] = `${prefix}${r[key]}`;
            } else {
                route[key] = r[key] as unknown;
            }
        }

        return route;
    });
}