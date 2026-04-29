import { Router } from 'express';

// Middleware
import { authenticateToken } from './auth.middleware.js';

// Controllers
import {
    register,
    checkEmail,
    login,
    refresh,
    logout,
    getCurrentUser,
} from './auth.controller.js';

const router = Router();

router.post('/auth/register', register);

router.get('/auth/check-email', checkEmail);

router.post('/auth/login', login);

router.post('/auth/refresh', refresh);

router.post('/auth/logout', logout);

router.get('/auth/me', authenticateToken, getCurrentUser);

export { router as authRouter };
