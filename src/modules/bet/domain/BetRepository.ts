import { Bet } from './Bet';
import { Optional } from '../../core/Optional';

export interface BetRepository {
    findById(id: string): Promise<Optional<Bet>>
    save(bet: Bet): Promise<Bet>
    updateState(bet: Bet): Promise<void>
    getByEventId(eventId: string): Promise<Bet[]>
    setResults(bets: Bet[]): Promise<void>
}