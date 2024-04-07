import axios, { AxiosError, AxiosResponse } from 'axios';
import { NextFunction, Request, Response } from 'express';

const AUTH_URL = 'https://localhost:5000';

export const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Verify role before fetching from database
    const accessToken = req.headers.authorization?.split(' ')[1];
    if (!accessToken) {
        res.status(401).json({ message: 'No access token provided' });
        return;
    }

    await axios
        .get(AUTH_URL + '/role', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then((response: AxiosResponse) => {
            req.userRole = response.data;
            next();
        })
        .catch((error: any) => {
            if (error.response.data.message === 'Access Token expired') {
                // User needs to verify refresh token through cookie (between auth and client)
                res.status(401).json({ message: 'Need new access Token.' });
            } else {
                res.status(500).json({
                    message: 'Internal server error. Please try again later',
                });
            }
            return;
        });
};
