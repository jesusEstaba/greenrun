import Joi from 'joi';
import { UseCase } from '../../core/UseCase';
import { ValidationException } from '../../core/ValidationException';
import { UserRepository } from '../domain/UserRepository';
import { User, UserRole, UserState } from '../domain/User';
import { PasswordRepository } from '../domain/PasswordRepository';

export class CreateUser implements UseCase<CreateUserAction> {
    private userRepository: UserRepository;
    private passwordRepository: PasswordRepository;

    constructor(
        userRepository: UserRepository,
        passwordRepository: PasswordRepository,
    ) {
        this.userRepository = userRepository;
        this.passwordRepository = passwordRepository;
    }

    async execute(action: CreateUserAction): Promise<object> {
        CreateUser.validation(action);
        const foundUserResult = await this.userRepository.findByUsernameOrEmailOrPhone(
            action.username,
            action.email,
            action.phone,
        );
        if (!foundUserResult.isEmpty()) {
            throw new ValidationException('User already exist');
        }

        const hash = await this.passwordRepository.encrypt(action.password);

        const user = {
            ...action,
            password: hash,
            role: UserRole.UserRole,
            userState: UserState.Allowed,
        } as User;

        const { password, ...created } = await this.userRepository.save(user);

        return Promise.resolve(created);
    }

    private static validation(action: CreateUserAction) {
        const schema = Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            phone: Joi.string().required(),
            email: Joi.string().required(),
            username: Joi.string().required(),
            password: Joi.string().required(),
            address: Joi.string().required(),
            gender: Joi.string().required(),
            birthDate: Joi.string().required(),
            countryId: Joi.string().required().length(2),
            city: Joi.string().required(),
            category: Joi.string().required(),
            documentId: Joi.string().required(),
        });

        const { error } = schema.validate(action);
        if (error) {
            throw new ValidationException(error.toString());
        }
    }
}

export class CreateUserAction {
    constructor(
        public firstName: string,
        public lastName: string,
        public phone: string,
        public email: string,
        public username: string,
        public password: string,
        public address: string,
        public gender: string,
        public birthDate: string,
        public countryId: string,
        public city: string,
        public category: string,
        public documentId: string,
    ) {
    }
}