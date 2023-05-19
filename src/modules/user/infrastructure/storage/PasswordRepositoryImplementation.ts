import { PasswordRepository } from '../../domain/PasswordRepository';
import bcrypt from 'bcrypt';

export class PasswordRepositoryImplementation implements PasswordRepository {
    async encrypt(password: string): Promise<string> {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);

        return Promise.resolve(hash);
    }
}