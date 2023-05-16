import { BetRepository } from '../../domain/BetRepository';
import { Optional } from '../../../core/Optional';
import { Bet } from '../../domain/Bet';
import { KnexRepository } from '../../../core/infrastructure/storage/KnexRepository';

export class BetRepositoryImplementation implements BetRepository {
    private knexRepository: KnexRepository<Bet>;

    constructor() {
        this.knexRepository = new KnexRepository<Bet>('bets');
    }

    async findById(id: string): Promise<Optional<Bet>> {
        return this.knexRepository.findById(id);
    }

    async save(bet: Bet): Promise<Bet> {
        return this.knexRepository.save(bet);
    }

    async getByEventId(eventId: string): Promise<Bet[]> {
        return this.knexRepository.getByField({
            event_id: eventId,
        });
    }

    async setResults(bets: Bet[]): Promise<void> {
        return;
    }
}