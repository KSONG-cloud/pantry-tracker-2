// Types
import type { QueryResult } from './node_modules/@types/pg/index.js';

// Environment variables
import dotenv from 'dotenv';
dotenv.config();

// Express/Server setup
import express from 'express';
import cors from 'cors';
const app = express();
app.use(express.json());

// app.use(cors({
//   origin: 'http://localhost:5173'
// }));
app.use(cors());

const PORT = process.env.PORT || 3001;

// Database
import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: Number(process.env.DB_PORT ?? 5432),
});

app.get('/', (req, res) => {
    console.log('Received a request at /');
    res.send('Hello, welcome to the Pantry Tracker server!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
