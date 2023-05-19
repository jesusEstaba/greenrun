import { Request, ResponseObject, ResponseToolkit } from 'hapi';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ValidationException } from '../../../../core/ValidationException';
import { Auth } from '../../../domain/Auth';
import { UserRepository } from '../../../../user/domain/UserRepository';
import { UserRepositoryImplementation } from '../../../../user/infrastructure/storage/UserRepositoryImplementation';
import Joi from 'joi';
import { LoginAction } from '../../../application/Login';

const JWT_SECRET = 'changeit';

export class AuthHandler {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepositoryImplementation();
    }

    async handleAuth(r: Request, h: ResponseToolkit): Promise<ResponseObject> {
        const action = r.payload as LoginAction;

        const schema = Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
        });

        const { error } = schema.validate(action);
        if (error) {
            throw new ValidationException(error.toString());
        }

        const userResult = await this.userRepository.findByUsername(action.username);
        if (userResult.isEmpty()) {
            throw new ValidationException('Invalid credentials');
        }

        const { id, role, password: passwd } = userResult.getValue();

        const isMatch = bcrypt.compareSync(action.password, passwd);
        if (!isMatch) {
            throw new ValidationException('Invalid credentials');
        }

        const auth = {
            id: id.toString(),
            role,
        } as Auth;
        const token = jwt.sign(auth, JWT_SECRET, { expiresIn: '1h' });

        return h.response({ token }).code(200);
    }
}