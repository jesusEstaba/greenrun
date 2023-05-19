import { ServerRoute } from 'hapi';

export function routeExcluder(routes: ServerRoute[], fieldsToExclude: string[]): ServerRoute[] {
    return routes.map(r => {
        const route = {} as ServerRoute;
        const keys = Object.keys(r).filter(key => !fieldsToExclude.some(k => k === key));

        for (const key of keys) {
            route[key] = r[key] as unknown;
        }

        return route;
    });
}