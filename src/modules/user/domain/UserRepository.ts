import { User, UserState } from './User';
import { Optional } from '../../core/Optional';

export interface UserRepository {
    findById(id: string): Promise<Optional<User>>
    findByUsername(username: string): Promise<Optional<User>>
    findByUsernameOrEmailOrPhone(
        username: string,
        email: string,
        phone: string,
    ): Promise<Optional<User>>
    save(user: User): Promise<User>
    setState(id: string, state: UserState): Promise<void>
}