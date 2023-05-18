import { UserRepository } from '../../domain/UserRepository';
import { CreateUser, CreateUserAction } from '../CreateUser';
import { Event } from '../../../bet/domain/Event';
import { mockUserRepo } from './mocks';
import { UserRole, UserState } from '../../domain/User';
import { Optional } from '../../../core/Optional';

let userRepo: UserRepository;
let useCase: CreateUser;

describe('create user', () => {
    it('when create user should save a user', async () => {
        const result = await useCase.execute({
            firstName: 'Lewis',
            lastName: 'Hamilton',
            phone: '+44 1442 123456',
            email: 'lhamilton@mercedes.com',
            username: 'lhamilton',
            address: '123 Main Street',
            gender: 'Male',
            birthDate: '1985-01-07',
            countryId: 'GB',
            city: 'Stevenage',
            category: 'racer',
            documentId: 'LL 99 99 99 L',
        } as CreateUserAction);

        expect(result).toMatchObject({
            id: 'user-123',
            role: UserRole.UserRole,
            userState: UserState.Allowed,
        });
        expect(userRepo.save).toBeCalledTimes(1);
    });

    it('when create user with existent username should fail', async () => {
        try {
            await useCase.execute({
                firstName: 'Lewis',
                lastName: 'Hamilton',
                phone: '+44 1442 123456',
                email: 'lhamilton@mercedes.com',
                username: 'existent',
                address: '123 Main Street',
                gender: 'Male',
                birthDate: '1985-01-07',
                countryId: 'GB',
                city: 'Stevenage',
                category: 'racer',
                documentId: 'LL 99 99 99 L',
            } as CreateUserAction);
            expect(false).toBeTruthy();
        } catch (e: unknown) {
            expect(`${e.toString()}`).toEqual('Error: User already exist');
        }
    });

    beforeEach(() => {
        userRepo = mockUserRepo();

        userRepo.save = jest.fn().mockImplementation((event: Event) => (
            { ...event, id: 'user-123' } as Event
        ));
        userRepo.findByUsernameOrEmailOrPhone = jest.fn().mockImplementation((u: string) => {
            if (u === 'existent') {
                return new Optional(new Event());
            }

            return new Optional(undefined);
        });

        useCase = new CreateUser(
            userRepo,
        );
    });
});