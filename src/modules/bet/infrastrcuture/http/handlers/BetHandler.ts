import { EventRepository } from '../../../domain/EventRepository';
import { EventRepositoryImplementation } from '../../storage/EventRepositoryImplementation';
import { Request, ResponseObject, ResponseToolkit } from 'hapi';
import { BetRepository } from '../../../domain/BetRepository';
import { BetRepositoryImplementation } from '../../storage/BetRepositoryImplementation';
import { CreateBet, CreateBetAction } from '../../../application/CreateBet';
import { Odd } from '../../../domain/Odd';
import { WalletRepository } from '../../../domain/WalletRepository';
import { WalletRepositoryImplementation } from '../../storage/WalletRepositoryImplementation';
import { PlaceBet, PlaceBetAction } from '../../../application/PlaceBet';
import { UserBetRepository } from '../../../domain/UserBetRepository';
import { UserBetRepositoryImplementation } from '../../storage/UserBetRepositoryImplementation';
import { Currency } from '../../../../core/Currency';
import { SettleEventResult, SettleEventResultAction } from '../../../application/SettleEventResult';
import { SetBetStatus, SetBetStatusAction } from '../../../application/SetBetStatus';
import { Auth } from '../../../../auth/domain/Auth';

export class BetHandler {
    private readonly eventRepository: EventRepository;
    private readonly betRepository: BetRepository;
    private readonly userBetStatus: UserBetRepository;
    private readonly walletRepository: WalletRepository;
    private create: CreateBet;
    private place: PlaceBet;
    private settle: SettleEventResult;
    private status: SetBetStatus;

    constructor() {
        this.eventRepository = new EventRepositoryImplementation();
        this.betRepository = new BetRepositoryImplementation();
        this.userBetStatus = new UserBetRepositoryImplementation();
        this.walletRepository = new WalletRepositoryImplementation();
        this.create = new CreateBet(
            this.betRepository,
            this.eventRepository,
        );
        this.place = new PlaceBet(
            this.walletRepository,
            this.betRepository,
            this.userBetStatus,
        );
        this.settle = new SettleEventResult(
            this.betRepository,
            this.userBetStatus,
            this.walletRepository,
        );
        this.status = new SetBetStatus(
            this.betRepository,
        );
    }

    async handleCreate(r: Request, h: ResponseToolkit): Promise<ResponseObject> {
        const { odd } = r.payload as { odd: number };

        const action = r.payload as CreateBetAction;
        action.odd = new Odd(odd);

        const created = await this.create.execute(action);
        return h.response(created).code(200);
    }

    async handlePlace(r: Request, h: ResponseToolkit): Promise<ResponseObject> {
        const { amount } = r.payload as { amount: number };

        const action = r.payload as PlaceBetAction;
        action.amount = new Currency(amount);

        const { id } = r.pre.auth as Auth;
        action.userId = id;

        const created = await this.place.execute(action);
        return h.response(created).code(200);
    }

    async handleSettle(r: Request, h: ResponseToolkit): Promise<ResponseObject> {
        const action = r.payload as SettleEventResultAction;

        await this.settle.execute(action);
        return h.response({}).code(200);
    }

    async handleState(r: Request, h: ResponseToolkit): Promise<ResponseObject> {
        const action = r.payload as SetBetStatusAction;

        await this.status.execute(action);
        return h.response({}).code(200);
    }
}