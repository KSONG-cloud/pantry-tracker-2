import { pool } from '../database/database.js';
import type { QueryResult } from 'pg';
import type {
    FoodMapType,
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
