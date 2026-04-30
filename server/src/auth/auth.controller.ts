// Cookies
import { cookieOptionsAccess, cookieOptionsRefresh } from './auth.cookies.js';

// Email Service
import { sendVerificationEmail } from './auth.emailService.js';

// Service Functions for Authentication
import {
    registerUser,
    checkEmailExists,
    verifyAccount,
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

        // The "Fake" Email Sender (For local testing)
        // We create the exact link the user will eventually click in their email
        const verificationLink = `${process.env.CLIENT_ORIGIN}/verify?token=${user.verification_token}`;

        // console.log('\n----------------------------------------');
        // console.log('🚨 NEW USER REGISTERED! 🚨');
        // console.log(`Send this email to: ${email}`);
        // console.log(`Click here to verify: ${verificationLink}`);
        // console.log('----------------------------------------\n');
        await sendVerificationEmail(email, user.verification_token);

        // delete verification token from the user object before sending it back to the client
        delete user.verification_token;

        // Send a success message back to React
        res.status(201).json({
            message:
                'Registration successful. Please check your email to verify your account.',
            user: user,
        });

        // res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

export const checkEmail = async (req: Request, res: Response) => {
    try {
        const email = req.query.email as string;

        if (!email) {
            res.status(400).json({
                message: 'Email query parameter is required',
            });
            return;
        }
        const emailExists = await checkEmailExists(email);
        res.status(200).json({ emailExists });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const token = req.body.token;
        console.log('Received verification token:', token);

        if (!token) {
            res.status(400).json({ message: 'Verification token is required' });
            return;
        }

        const verificationResult = await verifyAccount(token);

        res.status(200).json({
            message: 'Account verified successfully. You can now log in.',
            user: verificationResult,
        });
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

        // Don't allow login if the account is not verified
        if (!user.is_verified) {
            res.status(403).json({
                message:
                    'Account not verified. Please check your email and verify before logging in.',
            });
            return;
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = await generateRefreshToken(user.id);

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
