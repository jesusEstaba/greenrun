import { UserRepository } from '../../domain/UserRepository';
import { PasswordRepository } from '../../domain/PasswordRepository';

export function mockUserRepo(): UserRepository {
    return {
        save: jest.fn(),
        findByUsernameOrEmailOrPhone: jest.fn(),
        findById: jest.fn(),
        findByUsername: jest.fn(),
        setState: jest.fn(),
    };
}

export function mockPassRepo(): PasswordRepository {
    return {
        encrypt:jest.fn(),
    };
}