// Types
import type { QueryResult } from '../node_modules/@types/pg/index.js';
import type { food, newFoodUnitType } from './types/types.js';

// Environment variables
import dotenv from 'dotenv';
dotenv.config();

// Express/Server setup
import express from 'express';
import cors from 'cors';
const app = express();
app.use(express.json());

app.use(cors());

const PORT = process.env.PORT || 3001;


import { pool } from './database/database.js';

app.get('/users', (req, res) => {
    pool.query('SELECT * FROM food', (error: Error | null, results: QueryResult<food>) => {
        if (error) {
            console.log('Error querying database:', error);
            res.status(400).json(error);
            return;
        }
        res.status(200).json(results.rows);
    });
});

app.get('/', (req, res) => {
    console.log('Received a request at /!');
    res.send('Hello, welcome to the Pantry Tracker server!');
});


// Get food items from pantry
app.get('/food/:id', (req, res) => {
    pool.query(
        `SELECT 
            pantry.*, 
            food.food_name,
            pantry.quantity::int AS quantity 
        FROM pantry 
        JOIN food ON pantry.food_id = food.id
        WHERE user_id = $1 
        AND removed = false`, 
        [Number(req.params.id)],
        (error: Error | null, results: QueryResult<newFoodUnitType>) => {
        if (error) {
            console.log('Error querying database:', error);
            res.status(400).json(error);
            return;
        }
        res.status(200).json(results.rows);
    });
});




// Get food groups
app.get('/food-groups', (req, res) => {
    pool.query('SELECT foodgroups FROM account WHERE id = 1', (error: Error | null, results: QueryResult<food>) => {
        if (error) {
            console.log('Error querying database:', error);
            res.status(400).json(error);
            return;
        }
        res.status(200).json(results.rows);
    });
});




// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
