// Vitest
import {
    describe,
    it,
    expect,
    beforeAll,
    afterAll,
    expectTypeOf,
} from 'vitest';

// Database
import { Pool } from 'pg';

// Functions to test
import * as foodRepository from '../src/database/food.repository';

// Types
import type { FoodMapType } from '../src/types/types';
import { devNull } from 'node:os';

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DB_NAME:', process.env.DB_NAME);

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: Number(process.env.DB_PORT ?? 5432),
});

// Close pool after all tests
afterAll(async () => {
    await pool.end(); // closes all connections
});

// ---------- Food Table ----------
describe('addFood', () => {
    it('should insert a food and return id and name (i.e. FoodMapType)', async () => {
        const foodName = 'Mutton';

        const result = await foodRepository.addFood(foodName);

        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('food_name');
        expectTypeOf(result).toExtend<FoodMapType>();
        expect(result.food_name).toBe(foodName);

        // Cleanup inserted row
        await pool.query('DELETE FROM food WHERE id = $1', [result.id]);
    });

    it('should throw if insert fails', async () => {
        await expect(foodRepository.addFood('')).rejects.toThrow();
    });

    it('should throw error if no food is provided', async () => {
        await expect(foodRepository.addFood('')).rejects.toThrow();
    });

    it('should throw error if no food is provided', async () => {
        await expect(foodRepository.addFood('       ')).rejects.toThrow();
    });

    it('should throw error if null is provided', async () => {
        const nullObj: any = null;
        await expect(foodRepository.addFood(nullObj)).rejects.toThrow();
    });
});

describe('getFoodMap', () => {
    it('returns the food map', async () => {
        const result = await foodRepository.getFoodMap();

        const expectedSorted = [
            { id: 1, food_name: 'Chicken' },
            { id: 2, food_name: 'Egg' },
            { id: 3, food_name: 'Milk' },
            { id: 4, food_name: 'Chocolate' },
            { id: 5, food_name: 'Strawberry' },
            { id: 6, food_name: 'Apple' },
            { id: 7, food_name: 'Pineapple' },
            { id: 8, food_name: 'Duck' },
            { id: 9, food_name: 'Cucumber' },
            { id: 10, food_name: 'Celery' },
            { id: 11, food_name: 'Orange' },
            { id: 12, food_name: 'Onion' },
            { id: 13, food_name: 'Garlic' },
            { id: 14, food_name: 'Tomato' },
            { id: 15, food_name: 'Peach' },
            { id: 16, food_name: 'Beef' },
        ].sort((a, b) => a.id - b.id);

        const resultSorted = result.sort((a, b) => a.id - b.id);

        expect(resultSorted).toEqual(expectedSorted);
    });
});

// ---------- Pantry Table ----------

describe('getPantryByUser', () => {
    it('It should return the pantry for user 1', async () => {
        const USERID = 1;
        const result = await foodRepository.getPantryByUser(USERID);

        const expectedSorted = [
            {
                id: 1,
                food_id: 1,
                expiry_date: null,
                bestbefore_date: null,
                added_date: '2024-09-08',
                quantity: 3,
                units: null,
                foodgroup_id: "6",
                removed: false,
                user_id: 1,
                food_name: 'Chicken',
            },
            {
                id: 2,
                food_id: 3,
                expiry_date: null,
                bestbefore_date: '2025-03-08',
                added_date: '2024-03-08',
                quantity: 6,
                units: null,
                foodgroup_id: "3",
                removed: false,
                user_id: 1,
                food_name: 'Milk',
            },
            {
                id: 3,
                food_id: 2,
                expiry_date: '2025-10-08',
                bestbefore_date: null,
                added_date: '2024-07-08',
                quantity: 5,
                units: null,
                foodgroup_id: "6",
                removed: false,
                user_id: 1,
                food_name: 'Egg',
            },
            {
                id: 8,
                food_id: 4,
                expiry_date: '2025-12-08',
                bestbefore_date: null,
                added_date: '2024-09-08',
                quantity: 10,
                units: null,
                foodgroup_id: "4",
                removed: false,
                user_id: 1,
                food_name: 'Chocolate',
            },
            {
                id: 7,
                food_id: 4,
                expiry_date: '2025-12-08',
                bestbefore_date: null,
                added_date: '2024-09-08',
                quantity: 10,
                units: null,
                foodgroup_id: "4",
                removed: false,
                user_id: 1,
                food_name: 'Chocolate',
            },
            {
                id: 6,
                food_id: 4,
                expiry_date: '2025-12-08',
                bestbefore_date: null,
                added_date: '2024-09-08',
                quantity: 10,
                units: null,
                foodgroup_id: "4",
                removed: false,
                user_id: 1,
                food_name: 'Chocolate',
            },
            {
                id: 5,
                food_id: 4,
                expiry_date: '2025-12-08',
                bestbefore_date: null,
                added_date: '2024-09-08',
                quantity: 10,
                units: null,
                foodgroup_id: "4",
                removed: false,
                user_id: 1,
                food_name: 'Chocolate',
            },
            {
                id: 4,
                food_id: 4,
                expiry_date: '2025-12-08',
                bestbefore_date: null,
                added_date: '2024-09-08',
                quantity: 10,
                units: null,
                foodgroup_id: "4",
                removed: false,
                user_id: 1,
                food_name: 'Chocolate',
            },
        ].sort((a, b) => a.id - b.id);


        const expectedFixDate = expectedSorted.map(row => ({
            ...row,
            expiry_date: row.expiry_date ? new Date(row.expiry_date) : null,
            bestbefore_date:  row.bestbefore_date ? new Date(row.bestbefore_date) : null,
            added_date: new Date(row.added_date)
        }));

        const resultSorted = result.sort((a, b) => a.id - b.id);

        expect(resultSorted).toEqual(expectedSorted);
    });
});

// ---------- Account Table ----------

// describe('Account', () => {

// })
