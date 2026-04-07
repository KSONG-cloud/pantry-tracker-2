import type { CookieOptions } from 'express';

const isProduction = process.env.NODE_ENV === 'production';

export const cookieOptionsAccess: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: process.env.ACCESS_TOKEN_EXPIRATION
        ? parseInt(process.env.ACCESS_TOKEN_EXPIRATION)
        : 900000, // 15 minutes
};

export const cookieOptionsRefresh: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: process.env.REFRESH_TOKEN_EXPIRATION
        ? parseInt(process.env.REFRESH_TOKEN_EXPIRATION)
        : 604800000, // 7 days
};
