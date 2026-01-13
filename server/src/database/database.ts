// Environment variables
import dotenv from 'dotenv';
dotenv.config();

// Database
import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: Number(process.env.DB_PORT ?? 5432),
});

export { pool };