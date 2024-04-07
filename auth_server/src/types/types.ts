import { Express } from 'express';

/**
 * Global packages
 */
declare global {
    namespace Express {
        interface Request {
            user: UserData;
            accessToken: string;
        }
    }
}

/**
 * Custom Types
 */
export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
};

export type Payload = {
    id: string;
};

export type UserData = Omit<User, 'password'>;

/**
 * Custom Enums
 */
export enum Roles {
    User = 'user',
    Premium = 'premium',
    Admin = 'admin',
}
