import { UserRepository } from '../../domain/UserRepository';
import { mockUserRepo } from './mocks';
import { User, UserRole, UserState } from '../../domain/User';
import { Optional } from '../../../core/Optional';
import { BlockUser, BlockUserAction } from '../BlockUser';

let userRepo: UserRepository;
let useCase: BlockUser;

describe('block user', () => {
    it('when request block should change user state to block', async () => {
        await useCase.execute({
            userId: 'user-123',
        } as BlockUserAction);

        expect(userRepo.setState).toHaveBeenCalledWith(
            'user-123',
            UserState.Blocked,
        );
        expect(userRepo.setState).toBeCalledTimes(1);
        expect(userRepo.findById).toBeCalledTimes(1);
    });

    it('when request block to an admin user should fail', async () => {
        try {
            await useCase.execute({
                userId: 'admin-123',
            } as BlockUserAction);
            expect(false).toBeTruthy();
        } catch (e: unknown) {
            expect(`${e.toString()}`).toEqual('Error: You Can not block a Admin');
        }
    });

    it('when request block to a non existent user should fail', async () => {
        try {
            await useCase.execute({
                userId: 'user-404',
            } as BlockUserAction);
            expect(false).toBeTruthy();
        } catch (e: unknown) {
            expect(`${e.toString()}`).toEqual('Error: User user-404 not found');
        }
    });

    beforeEach(() => {
        userRepo = mockUserRepo();
        userRepo.findById = jest.fn().mockImplementation((id: string) => {
            if (id === 'user-123') {
                return new Optional({} as User);
            }

            if (id === 'admin-123') {
                return new Optional({
                    role: UserRole.AdminRole,
                } as User);
            }

            return new Optional(undefined);
        });

        useCase = new BlockUser(
            userRepo,
        );
    });
});