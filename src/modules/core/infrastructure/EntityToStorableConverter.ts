export class EntityToStorableConverter {
    static convert(obj: Record<string, unknown>): Record<string, unknown> {
        const result: Record<string, unknown> = {};

        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const camelKey = EntityToStorableConverter.CamelToSnake(key);
                const entity: unknown = obj[key];

                if (entity && typeof entity !== 'string' && Object.keys(entity).length) {
                    const entityTyped = entity as { getValue() };
                    result[camelKey] = entityTyped.getValue();
                } else {
                    result[camelKey] = entity;
                }
            }
        }

        return result;
    }

    private static CamelToSnake(str: string): string {
        return str.replace(/[\w]([A-Z])/g, function (match) {
            return match[0] + '_' + match[1].toLowerCase();
        }).toLowerCase();
    }
}