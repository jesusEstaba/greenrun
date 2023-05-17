import { UserBet } from './UserBet';

export interface UserBetRepository {
    save(bet: UserBet): Promise<UserBet>
    getByBetIds(ids: string[]): Promise<UserBet[]>
    setStatesByBetId(bets: UserBet[]): Promise<void>
}