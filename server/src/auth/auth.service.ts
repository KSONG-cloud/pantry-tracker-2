// Service Functions for Authentication
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { pool } from '../database/database.js';

export const registerUser = async (
    username: string,
    email: string,
    password: string
) => {
    // Check if user already exists
    const existingUser = await pool.query(
        'SELECT id FROM account WHERE email = $1',
        [email]
    );

    if (existingUser.rows.length > 0) {
        throw new Error('User already exists');
    }

    // Hash password
    const saltRounds = process.env.SALT ? parseInt(process.env.SALT) : 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    // Insert user into database
    const result = await pool.query(
        `INSERT INTO account (username, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, username, email`,
        [username, email, passwordHash]
    );

    return result.rows[0];
};

export const generateAccessToken = (userId: number) => {
    const payload = { userId };
    const secret = process.env.JWT_ACCESS_SECRET as string;

    if (!secret) {
        throw new Error('JWT_ACCESS_SECRET is not defined');
    }

    const options: SignOptions = { expiresIn: '15m' };

    return jwt.sign(payload, secret, options);
};

export const deleteRefreshTokensByUser = async (userId: number) => {
    await pool.query('DELETE FROM refreshtokens WHERE user_id = $1', [userId]);
};

export const deleteRefreshToken = async (refreshToken: string) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');

    await pool.query('DELETE FROM refreshtokens WHERE token = $1', [
        hashedToken,
    ]);
};

export const generateRefreshToken = async (userId: number) => {
    const payload = { userId };
    const secret = process.env.JWT_REFRESH_SECRET as string;

    if (!secret) {
        throw new Error('JWT_REFRESH_SECRET is not defined');
    }
    const options: SignOptions = { expiresIn: '7d' };

    return jwt.sign(payload, secret, options);
};

export const saveRefreshToken = async (
    userId: number,
    refreshToken: string
) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');

    try {
        await pool.query(
            `INSERT INTO refreshtokens (user_id, token, expires_at, created_at)
            VALUES ($1, $2, $3, $4)`,
            [
                userId,
                hashedToken,
                new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                new Date(Date.now()),
            ]
        );
    } catch (error) {
        console.error('Error saving refresh token:', error);
        throw new Error('Error saving refresh token');
    }
};

export const validateLogin = async (email: string, password: string) => {
    const result = await pool.query(
        'SELECT id, username, email, password_hash FROM account WHERE email = $1',
        [email]
    );

    if (result.rows.length === 0) {
        throw new Error('Invalid email or password');
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
        throw new Error('Invalid email or password');
    }

    return { id: user.id, username: user.username, email: user.email };
};

export const refreshSession = async (refreshToken: string) => {
    const secret = process.env.JWT_REFRESH_SECRET;

    if (!secret) {
        throw new Error('JWT_REFRESH_SECRET is not defined');
    }

    let decoded: { userId: number };
    try {
        // Verify the refresh token
        decoded = jwt.verify(refreshToken, secret) as { userId: number };
    } catch (error) {
        throw new Error('INVALID_REFRESH_TOKEN');
    }

    // Check if the refresh token exists in the database
    const hashedToken = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');

    let result;
    try {
        result = await pool.query(
            'SELECT id FROM refreshtokens WHERE token = $1',
            [hashedToken]
        );
    } catch (error) {
        console.error('DB ERROR during refresh lookup:', error);
        throw new Error('DATABASE_ERROR');
    }

    if (result.rows.length === 0) {
        try {
            await deleteRefreshTokensByUser(decoded.userId);
        } catch (error) {
            console.error(
                'Error deleting refresh tokens after reuse detection:',
                error
            );
        }

        throw new Error('TOKEN_REUSE_DETECTED');
    }

    // If valid, generate a new access token and refresh token
    try {
        const userId = decoded.userId;
        const newAccessToken = generateAccessToken(userId);
        const newRefreshToken = await generateRefreshToken(userId);

        // Delete the old refresh token from the database
        await deleteRefreshToken(refreshToken);

        // Save the new refresh token in the database
        await saveRefreshToken(userId, newRefreshToken);

        // Return the new tokens
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
        console.error('Error during session refresh:', error);
        throw new Error('DATABASE_ERROR');
    }
};

export const fetchUser = async (userId: number) => {
    const result = await pool.query(
        'SELECT id, username, email FROM account WHERE id = $1',
        [userId]
    );

    if (result.rows.length === 0) {
        throw new Error('User not found');
    }

    return result.rows[0];
};
