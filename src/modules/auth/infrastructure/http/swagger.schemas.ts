import { entityToSchema } from '../../../core/infrastructure/http/swagger/entityToSchema';
import { LoginAction } from '../../application/Login';

export function loginSchema() {
    return entityToSchema(new LoginAction(
        'lhamilton',
        'best_rider_ever',
    ));
}
