// Types

// Environment variables
import dotenv from 'dotenv';
dotenv.config();

// Routes
import { router } from './route/route.js';
import { authRouter } from './auth/auth.routes.js';

// Express/Server setup
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cookieParser());
// app.use(helmet());
app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN,
        credentials: true,
    })
);

// App Use Routes
app.use(router);
app.use(authRouter);

const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
