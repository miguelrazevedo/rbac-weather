import { NextFunction, Request, Response } from 'express';
import { Users } from '../models/userModel';
import { Roles } from '../types/types';
import {
    generateAccessToken,
    verifyAccessToken,
    verifyRefreshToken,
} from '../utils/jsonwebtoken';
import { TokenExpiredError } from 'jsonwebtoken';

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const { id } = verifyAccessToken(token);
            // Put the user in the Request except the password
            req.user = await Users.findById(id).select('-password');
            next();
        } catch (error) {
            // Se chegar aqui a token expirou, logo tem-se que fazer uma nova com a refresh
            // Enviar resposta a dizer que tem de ser validada com a refresh (que se encontra na cookie - entre auth e cliente)
            if (error instanceof TokenExpiredError) {
                res.status(401).json({ message: 'Access Token expired' });
                return;
            }
        }
    }

    if (!token) {
        res.status(401).json({
            message: 'User not authorized. Reason: Token was not provided.',
        });
        return;
    }
};
