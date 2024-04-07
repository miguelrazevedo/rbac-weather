import { NextFunction, Request, Response } from 'express';
import { Roles } from '../types/types';

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== Roles.Admin) {
        res.status(401).json({
            message: 'You do not have permissions for this',
        });
        return;
    }

    next();
};
