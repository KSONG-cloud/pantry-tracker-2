// Cookies
import { cookieOptionsAccess, cookieOptionsRefresh } from './auth.cookies.js';

// Service Functions for Authentication
import {
    registerUser,
    generateAccessToken,
    generateRefreshToken,
    validateLogin,
    refreshSession,
    deleteRefreshToken,
    saveRefreshToken,
    fetchUser,
} from './auth.service.js';

// Types
import type { Request, Response } from 'express';

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const user = await registerUser(username, email, password);
        const accessToken = generateAccessToken(user.id);
        const refreshToken = await generateRefreshToken(user.id);

        await saveRefreshToken(user.id, refreshToken);

        res.cookie('accessToken', accessToken, cookieOptionsAccess);

        res.cookie('refreshToken', refreshToken, cookieOptionsRefresh);

        res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const user = await validateLogin(email, password);
        const accessToken = generateAccessToken(user.id);
        const refreshToken = await generateRefreshToken(user.id);

        console.log('Generated refresh token for user:', user);

        await saveRefreshToken(user.id, refreshToken);

        res.cookie('accessToken', accessToken, cookieOptionsAccess);

        res.cookie('refreshToken', refreshToken, cookieOptionsRefresh);

        res.status(200).json({ message: 'Logged in successfully', user });
    } catch (error) {
        res.status(401).json({ message: 'Invalid credentials', error: error });
    }
};

export const refresh = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token missing' });
        }

        // Validate the refresh token and generate a new access token
        const result = await refreshSession(refreshToken);

        if (!result.accessToken || !result.refreshToken) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        res.cookie('accessToken', result.accessToken, cookieOptionsAccess);

        res.cookie('refreshToken', result.refreshToken, cookieOptionsRefresh);

        res.status(200).json({
            message: 'Access token refreshed successfully',
        });
    } catch (error: any) {
        switch (error.message) {
            case 'INVALID_REFRESH_TOKEN':
                return res
                    .status(403)
                    .json({ message: 'Invalid refresh token' });

            case 'TOKEN_REUSE_DETECTED':
                return res
                    .status(403)
                    .json({ message: 'Refresh token reuse detected' });

            case 'DATABASE_ERROR':
                return res.status(500).json({ message: 'Server error' });

            default:
                return res
                    .status(500)
                    .json({ message: 'Unknown server error' });
        }
    }
};

export const logout = async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        return res.status(400).json({ message: 'Refresh token missing' });
    }

    await deleteRefreshToken(token).catch((err) => {
        console.error('Error deleting refresh token during logout:', err);
    });

    res.clearCookie('accessToken', cookieOptionsAccess);
    res.clearCookie('refreshToken', cookieOptionsRefresh);

    res.status(200).json({ message: 'Logged out successfully' });
};

// Get user info for the currently authenticated user
export const getCurrentUser = async (req: Request, res: Response) => {
    console.log('Fetching current user with req.user:', req.user);
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const userId = req.user.userId;

        const result = await fetchUser(userId);

        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ result });
    } catch (error) {
        console.error('Error fetching current user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
