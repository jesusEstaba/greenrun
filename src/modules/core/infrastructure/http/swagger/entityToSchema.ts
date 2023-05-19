export function entityToSchema(obj: object): object {
    const result: Record<string, unknown> = {};

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const entity: unknown = obj[key];

            if (entity && entity.hasOwnProperty('value')) {
                try {
                    const entityTyped = entity as { getValue() };
                    result[key] = entityTyped.getValue();
                } catch (e) {
                    result[key] = entity;
                }
            } else {
                result[key] = entity;
            }
        }
    }

    return result;
}