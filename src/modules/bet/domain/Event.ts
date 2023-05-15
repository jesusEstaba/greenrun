import { Date } from '../../core/Date';

export class Event {
    id: string;

    sport: string;

    createdAt: Date;

    updatedAt: Date;

    deletedAt?: Date;

    deleted: boolean;
}