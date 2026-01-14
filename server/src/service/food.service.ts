// import { getFoodGroupsByUser } from '../controller/controller.js';
import * as foodRepository from '../database/food.repository.js';
import type { FoodUnitType, FoodGroupType } from '../types/types.js';

export const getPantryByUser = async (
    userId: number
): Promise<FoodUnitType[]> => {
    // Business logic lives here
    // (e.g. permissions, transformations later)

    return foodRepository.getPantryByUser(userId);
};

export const getFoodGroupsByUser = async (
    userId: number
): Promise<FoodGroupType | object> => {
    return foodRepository.getFoodGroupsByUser(userId);
};
