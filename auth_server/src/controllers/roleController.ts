import { Request, Response } from 'express';

export const getUserRole = async (req: Request, res: Response) => {
    if (req.user) {
        res.json({
            message: 'Access granted!',
            userId: req.user.id,
            role: req.user.role,
        });
    }
};
