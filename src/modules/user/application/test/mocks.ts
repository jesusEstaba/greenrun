import { UserRepository } from '../../domain/UserRepository';

export function mockUserRepo(): UserRepository {
    return {
        save: jest.fn(),
        findByUsernameOrEmailOrPhone: jest.fn(),
        findById: jest.fn(),
        setState: jest.fn(),
    };
}