import { Date } from '../../core/Date';

export class User {
    id: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    username: string;
    address: string;
    gender: string;
    birthDate: string;
    countryId: string;
    city: string;
    category: string;
    documentId: string;
    userState: UserState;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    deleted: boolean;
}

export enum UserRole {
    AdminRole = 'admin',
    UserRole = 'user',
}

export enum UserState {
    Allowed = 'allowed',
    Blocked = 'blocked',
}