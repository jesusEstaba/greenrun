import { UserRepository } from '../../../../user/domain/UserRepository';
import { Request, ResponseToolkit, ServerRoute } from 'hapi';
import { AuthenticationException } from '../../../domain/AuthenticationException';
import { UserState } from '../../../../user/domain/User';
import { PrivilegesException } from '../../../domain/PrivilegesException';
import { Auth } from '../../../domain/Auth';

type Middleware = (userRepository: UserRepository) => ServerRoute['handler'];

export const blockMiddleware: Middleware = (userRepository) => {
    return async (r: Request, h: ResponseToolkit) => {
        const { id } = r.pre.auth as Auth;

        if (!r.pre.auth || !id) {
            throw new AuthenticationException('Session does not exist');
        }

        const users = await userRepository.findById(id);
        if (users.isEmpty()) {
            throw new AuthenticationException('User does not exist');
        }

        if (users.getValue().userState === UserState.Blocked) {
            throw new PrivilegesException('Your user has been blocked');
        }

        return h.continue;
    };
};