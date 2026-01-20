import { pool } from '../database/database.js';
import type { QueryResult } from 'pg';
import type {
    FoodMapType,
    FoodUnitType,
    FoodGroupType,
    PantryRow,
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

// Pantry
// (PROBABLY NOT FROM GOOGLE) IS THIS GETTING TWO COLUMNS OF QUANTITY, PROBABLY HAVE TO INVESTIGATE
// I just changed the type the date is coming in as, not sure if it will cause problems
export const getPantryByUser = async (
    userId: number
): Promise<FoodUnitType[]> => {
    const result: QueryResult<FoodUnitType> = await pool.query(
        `SELECT 
            pantry.*, 
            food.food_name,
            pantry.quantity::int AS quantity ,
            pantry.added_date::text AS added_date,
            pantry.bestbefore_date::text AS bestbefore_date,
            pantry.expiry_date::text AS expiry_date
        FROM pantry 
        JOIN food ON pantry.food_id = food.id
        WHERE user_id = $1 
        AND removed = false`,
        [userId]
    );

    return result.rows;
};

export const addFoodItemPantry = async (foodItem: FoodUnitType) => {
    const result: QueryResult<FoodUnitType> = await pool.query(
        `INSERT INTO pantry (
            food_id,
            expiry_date,
            bestbefore_date,
            added_date,
            quantity,
            units,
            foodgroup_id,
            user_id
            ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [
            foodItem.food_id,
            foodItem.expiry_date,
            foodItem.bestbefore_date,
            foodItem.added_date,
            foodItem.quantity,
            foodItem.units,
            foodItem.foodgroup_id,
            foodItem.user_id,
        ]
    );

    if (result.rowCount === null) {
        throw new Error('Unexpected null rowCount');
    }

    if (result.rowCount <= 0) {
        throw new Error('Insert food item into pantry failed!');
    }

    if (result.rows.length === 0) {
        throw new Error('No rows returned');
    }

    const row = result.rows[0];

    if (!row) {
        throw new Error('Insert food item into pantry failed!');
    }

    // There is no food name here...
    const rowWithName = { ...row, food_name: foodItem.food_name };

    return rowWithName;
};

export const patchFoodItemPantry = async (
    userId: number,
    pantryId: number,
    setClause: string,
    values: PantryRow[keyof PantryRow][], // COME BACK TO CHANGE THE TYPE
    update_length: number
): Promise<FoodUnitType> => {
    const result = await pool.query(
        `UPDATE pantry
        SET ${setClause}
        WHERE id =$${update_length + 1} 
        AND user_id = $${update_length + 2}
        RETURNING *`,
        [...values, pantryId, userId]
    );

    if (result.rows.length === 0) throw new Error('Food item not found');

    return result.rows[0];
};

export const deletePantry = async (
    pantryId: number
) => {
    const result = await pool.query(
        `UPDATE pantry
        SET removed = true
        WHERE id = $1
        RETURNING *`,
        [pantryId]
    );

    if (result.rows.length === 0) throw new Error('Food item not found');

    return result.rows[0];
};

// Account/Food Group
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
