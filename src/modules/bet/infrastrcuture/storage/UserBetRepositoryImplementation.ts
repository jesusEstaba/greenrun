import { UserBetRepository } from '../../domain/UserBetRepository';
import { UserBet } from '../../domain/UserBet';
import { KnexRepository } from '../../../core/infrastructure/storage/KnexRepository';
import { Odd } from '../../domain/Odd';
import { Currency } from '../../../core/Currency';

export class UserBetRepositoryImplementation implements UserBetRepository {
    private knexRepository: KnexRepository<UserBet>;

    constructor() {
        this.knexRepository = new KnexRepository<UserBet>('user_bets');
    }

    async save(bet: UserBet): Promise<UserBet> {
        return this.knexRepository.save(bet);
    }

    async getByBetIds(ids: string[]): Promise<UserBet[]> {
        const bets = await this.knexRepository.getByFields('bet_id', ids);

        return bets.map(b => {
            const {
                odd,
                amount,
                ...rest
            } = b;

            return {
                ...rest,
                amount: new Currency(amount as number),
                odd: new Odd(odd as number),
            } as UserBet;
        });
    }
}