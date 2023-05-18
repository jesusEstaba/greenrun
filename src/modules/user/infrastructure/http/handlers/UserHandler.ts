import { Request, ResponseToolkit, ResponseObject } from 'hapi';
import { UserRepository } from '../../../domain/UserRepository';
import { CreateUser, CreateUserAction } from '../../../application/CreateUser';
import { UserRepositoryImplementation } from '../../storage/UserRepositoryImplementation';
import { BlockUser, BlockUserAction } from '../../../application/BlockUser';

export class UserHandler {
    private readonly userRepository: UserRepository;
    private create: CreateUser;
    private block: BlockUser;

    constructor() {
        this.userRepository = new UserRepositoryImplementation();
        this.create = new CreateUser(
            this.userRepository,
        );
        this.block = new BlockUser(
            this.userRepository,
        );
    }

    async handleCreate(r: Request, h: ResponseToolkit): Promise<ResponseObject> {
        const action = r.payload as CreateUserAction;
        const created = await this.create.execute(action);

        return h.response(created).code(200);
    }

    async handleBlock(r: Request, h: ResponseToolkit): Promise<ResponseObject> {
        const action = r.payload as BlockUserAction;
        const result = await this.block.execute(action);

        return h.response(result).code(200);
    }
}