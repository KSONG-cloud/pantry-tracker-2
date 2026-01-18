import { pool } from '../database/database.js';
import type { QueryResult } from 'pg';
import type {
    FoodMapType,
    FoodUnitType,
    FoodGroupType,
} from '../types/types.js';

// Food
export const getFoodMap = async (): Promise<
    { id: number; food_name: string }[]
> => {
    const result: QueryResult<{ id: number; food_name: string }> =
        await pool.query(
            `SELECT *, food.id::int as id
        FROM food`
        );

    return result.rows;
};

export const addFood = async (name: string): Promise<FoodMapType> => {
    // Empty string and null check
    if (!name || !name.trim()) {
        throw new Error('Food name cannot be empty');
    }

    const result: QueryResult<FoodMapType> = await pool.query(
        `INSERT INTO food (food_name) 
        VALUES ($1)
        RETURNING id, food_name`,
        [name]
    );

    if (result.rowCount === null) {
        throw new Error('Unexpected null rowCount');
    }

    if (result.rowCount <= 0) {
        throw new Error('Insert into food failed!');
    }

    if (result.rows.length === 0) {
        throw new Error('No rows returned');
    }

    const row = result.rows[0];

    if (!row) {
        throw new Error('Insert into food failed!');
    }

    return row;
};
export const getPantryByUser = async (
    userId: number
): Promise<FoodUnitType[]> => {
    const result: QueryResult<FoodUnitType> = await pool.query(
        `SELECT 
            pantry.*, 
            food.food_name,
            pantry.quantity::int AS quantity 
        FROM pantry 
        JOIN food ON pantry.food_id = food.id
        WHERE user_id = $1 
        AND removed = false`,
        [userId]
    );

    return result.rows;
};

type FoodGroupsRow = {
    foodgroups: FoodGroupType;
};

export const getFoodGroupsByUser = async (
    userId: number
): Promise<FoodGroupType> => {
    const result: QueryResult<FoodGroupsRow> = await pool.query(
        `SELECT foodgroups 
        FROM account 
        WHERE id = $1`,
        [userId]
    );

    const foodGroups = result.rows[0]?.foodgroups;

    if (!foodGroups) {
        throw new Error('Account not found');
    }

    return foodGroups;
};
