import { UserRepository } from '../../domain/UserRepository';
import { KnexRepository } from '../../../core/infrastructure/storage/KnexRepository';
import { User, UserState } from '../../domain/User';
import { Optional } from '../../../core/Optional';

export class UserRepositoryImplementation implements UserRepository {
    private knexRepository: KnexRepository<User>;

    constructor() {
        this.knexRepository = new KnexRepository<User>('users');
    }

    async save(user: User): Promise<User> {
        return this.knexRepository.save(user);
    }

    async setState(id: string, state: UserState): Promise<void> {
        await this.knexRepository.updateFieldsById(id, { user_state: state });

        return;
    }

    async findById(id: string): Promise<Optional<User>> {
        return this.knexRepository.findById(id);
    }

    async findByUsernameOrEmailOrPhone(username: string, email: string, phone: string): Promise<Optional<User>> {
        const [user] = await this.knexRepository.getByFieldOr({
            username,
            email,
            phone,
        });

        return new Optional(user);
    }

    async findByUsername(username: string): Promise<Optional<User>> {
        const [user] = await this.knexRepository.getByField({
            username,
        });

        return new Optional(user);
    }
}