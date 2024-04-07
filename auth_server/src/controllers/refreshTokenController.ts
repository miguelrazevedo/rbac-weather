import { NextFunction, Request, Response } from 'express';
import { generateAccessToken, verifyRefreshToken } from '../utils/jsonwebtoken';
import { Users } from '../models/userModel';

export const handleRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const cookies = req.cookies;
    if (!cookies.jwt) {
        res.status(401).json({ message: '' });
    }

    try {
        const refreshToken = cookies.jwt as string;
        const { id } = verifyRefreshToken(refreshToken);

        const user = await Users.findById(id);
        if (!user) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        const accessToken = generateAccessToken({ id: user.id });
        res.json({ accessToken });
    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: 'Authentication expired. Please login again',
        });
        return;
    }
};
