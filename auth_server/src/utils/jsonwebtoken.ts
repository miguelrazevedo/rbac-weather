import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Payload } from '../types/types';
dotenv.config();

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env;

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, JWT_ACCESS_SECRET!!) as Payload;
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, JWT_REFRESH_SECRET!!) as Payload;
};

export const generateAccessToken = (payload: Payload) => {
    return jwt.sign(payload, JWT_ACCESS_SECRET!!, {
        expiresIn: '20m',
    });
};

export const generateRefreshToken = (payload: Payload) => {
    return jwt.sign(payload, JWT_REFRESH_SECRET!!, {
        expiresIn: '30m',
    });
};
