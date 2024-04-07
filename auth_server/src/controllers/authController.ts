import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { Users } from '../models/userModel';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from '../utils/jsonwebtoken';
import { TokenExpiredError } from 'jsonwebtoken';
import { z } from 'zod';
import { Roles } from '../types/types';

export const registerUser = async (req: Request, res: Response) => {
    const registerSchema = z.object({
        name: z.string().trim(),
        email: z.string().email(),
        password: z.string(),
        role: z.string(),
    });

    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            message: "Please make sure you've added all the fields",
        });
        return;
    }

    const userExists = await Users.findOne({ email: result.data.email });
    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(); // Default value is 10
    const hashedPassword = await bcrypt.hash(result.data.password, salt);

    await Users.create({
        name: result.data.name,
        email: result.data.email,
        password: hashedPassword,
        role: result.data.role,
    });

    res.json({ message: 'User has been created' });
};

export const loginUser = async (req: Request, res: Response) => {
    const loginSchema = z.object({
        email: z.string().email(),
        password: z.string(),
    });

    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            message: "Please make sure you've added all the fields",
        });
        return;
    }

    const user = await Users.findOne({ email: result.data.email });

    if (user && (await bcrypt.compare(result.data.password, user.password!!))) {
        const refreshToken = generateRefreshToken({ id: user.id });
        const accessToken = generateAccessToken({ id: user.id });

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 20, // Same as refresh token
        });

        res.json({
            message: 'User has been logged in successfuly!',
            accessToken,
            user: {
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
        return;
    }
    res.status(400).json({ message: 'Invalid credentials' });
};

export const logout = async (req: Request, res: Response) => {
    res.clearCookie('jwt', { secure: true, sameSite: 'none' })
        .status(200)
        .json({
            message: 'User has been logged out',
        });
};

export const revalidateAccessToken = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies.jwt) {
        res.status(401).json({
            message: 'Refresh Token not found. Forbidden.',
        });
        return;
    }
    const refreshToken = cookies.jwt as string;

    // Verify Refresh Token
    try {
        const { id } = verifyRefreshToken(refreshToken);
        res.json({ newAccessToken: generateAccessToken({ id }) });
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            // Se chegar aqui é porque a refresh token expirou
            res.status(401).json({
                message: 'Refresh Token expired. Login again',
            });
        } else {
            res.status(500).json({
                message: 'Internal server error. Please try again later.',
            });
            console.log(err);
        }
        return;
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    const users = await Users.find({ email: { $ne: req.user.email } }).select(
        '-password'
    );

    res.json(users);
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (id === req.user.id) {
        res.status(401).json({ message: 'You cannot delete yourself' });
        return;
    }
    const user = await Users.deleteOne({ _id: id });

    if (user.deletedCount === 0) {
        res.status(400).json({ message: 'User does not exist' });
        return;
    }

    res.json({ message: 'User has been deleted' });
};
