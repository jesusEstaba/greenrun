import { EventRepository } from '../../domain/EventRepository';
import { BetRepository } from '../../domain/BetRepository';
import { UserBetRepository } from '../../domain/UserBetRepository';
import { WalletRepository } from '../../domain/WalletRepository';

export function betRepoMock(): BetRepository {
    return {
        findById: jest.fn(),
        save: jest.fn(),
        getByEventId: jest.fn(),
        setResults: jest.fn(),
        updateState: jest.fn(),
    };
}

export function eventRepoMock(): EventRepository {
    return {
        findById: jest.fn(),
        save: jest.fn(),
    };
}

export function userRepoMock(): UserBetRepository {
    return {
        getByBetIds: jest.fn(),
        save: jest.fn(),
        setStatesByBetId: jest.fn(),
    };
}

export function walletRepoMock(): WalletRepository {
    return {
        addWinnersFunds: jest.fn(),
        discountBet: jest.fn(),
    };
}