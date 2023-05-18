import Joi from 'joi';
import { UseCase } from '../../core/UseCase';
import { ValidationException } from '../../core/ValidationException';
import { UserRepository } from '../domain/UserRepository';
import { UserRole, UserState } from '../domain/User';

export class BlockUser implements UseCase<BlockUserAction> {
    private userRepository: UserRepository;

    constructor(
        userRepository: UserRepository,
    ) {
        this.userRepository = userRepository;
    }

    async execute(action: BlockUserAction): Promise<object> {
        BlockUser.validation(action);
        const userResult = await this.userRepository.findById(action.userId);

        if (userResult.isEmpty()) {
            throw new ValidationException(`User ${action.userId} not found`);
        }

        if (userResult.getValue().role === UserRole.AdminRole) {
            throw new ValidationException('You Can not block a Admin');
        }

        await this.userRepository.setState(action.userId, UserState.Blocked);

        return Promise.resolve({});
    }

    private static validation(action: BlockUserAction) {
        const schema = Joi.object({
            userId: Joi.string().required(),
        });

        const { error } = schema.validate(action);
        if (error) {
            throw new ValidationException(error.toString());
        }
    }
}

export class BlockUserAction {
    constructor(
        public userId: string,
    ) {
    }
}