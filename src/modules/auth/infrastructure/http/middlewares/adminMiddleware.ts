import { Request, ResponseToolkit, RouteOptions } from 'hapi';
import { UserRole } from '../../../../user/domain/User';
import { PrivilegesException } from '../../../domain/PrivilegesException';
import { AuthenticationException } from '../../../domain/AuthenticationException';
import { Auth } from '../../../domain/Auth';

export function adminMiddleware(r: Request, h: ResponseToolkit): RouteOptions {
    const { role } = r.pre.auth as Auth;

    if (!r.pre.auth || !role) {
        throw new AuthenticationException('Session does not exist');
    }

    if (role !== UserRole.AdminRole.toString()) {
        throw new PrivilegesException('You can not perform this action');
    }

    return h.continue;
}