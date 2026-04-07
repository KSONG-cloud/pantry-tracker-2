import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';

export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: 'Access token missing' });
    }

    try {
        const secret = process.env.JWT_ACCESS_SECRET;

        if (!secret) {
            throw new Error('JWT_ACCESS_SECRET is not defined');
        }
        const decoded = jwt.verify(token, secret);

        if (typeof decoded === 'string' || !decoded.userId) {
            return res.status(403).json({ message: 'Invalid token payload' });
        }

        req.user = { userId: decoded.userId };
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid access token' });
    }
};
