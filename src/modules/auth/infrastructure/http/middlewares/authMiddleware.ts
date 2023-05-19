import { Request, ResponseToolkit, RouteOptions } from 'hapi';
import * as jwt from 'jsonwebtoken';
import { AuthenticationException } from '../../../domain/AuthenticationException';
import { Auth } from '../../../domain/Auth';

const JWT_SECRET = 'changeit';

export function authMiddleware(r: Request, h: ResponseToolkit): RouteOptions {
    const authorizationHeader = r.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        throw new AuthenticationException('Missing authorization token');
    }

    const token = authorizationHeader.substring(7);
    try {
        r.pre.auth = jwt.verify(token, JWT_SECRET) as Auth;
    } catch (error) {
        throw new AuthenticationException('Invalid token');
    }

    return h.continue;
}