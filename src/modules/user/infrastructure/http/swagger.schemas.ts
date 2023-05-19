import { entityToSchema } from '../../../core/infrastructure/http/swagger/entityToSchema';
import { CreateUserAction } from '../../application/CreateUser';
import { BlockUserAction } from '../../application/BlockUser';

export function createUserSchema() {
    return entityToSchema(new CreateUserAction(
        'Lewis',
        'Hamilton',
        '+44 1442 123456',
        'lhamilton@mercedes.com',
        'lhamilton',
        'best_rider_ever',
        '123 Main Street',
        'Male',
        '1985-01-07',
        'GB',
        'Stevenage',
        'racer',
        'LL 99 99 99 L',
    ));
}

export function blockUserSchema() {
    return entityToSchema(new BlockUserAction(
        'user-123',
    ));
}