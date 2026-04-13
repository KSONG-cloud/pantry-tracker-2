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
    ssl: {
        rejectUnauthorized: false, // This tells Node it's okay to connect to Supabase's SSL cert
    },
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export { pool };




