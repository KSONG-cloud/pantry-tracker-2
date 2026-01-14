// Types
import type { QueryResult } from '../node_modules/@types/pg/index.js';
import type { food, FoodUnitType } from './types/types.js';

// Environment variables
import dotenv from 'dotenv';
dotenv.config();

// Routes
import { router } from './route/route.js';

// Express/Server setup
import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

// App Use Routes
app.use(router);

const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
