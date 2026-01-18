import * as foodRepository from '../database/food.repository.js';
import type {
    FoodMapType,
} from '../types/types.js';

// Food
export const getFoodMap = async (): Promise<
    FoodMapType[]
> => {
    return foodRepository.getFoodMap();
};

// Pantry
export const getPantryByUser = async (
    userId: number
): Promise<FoodUnitType[]> => {
    // Business logic lives here
    // (e.g. permissions, transformations later)

    return foodRepository.getPantryByUser(userId);
};

export const getFoodGroupsByUser = async (
    userId: number
): Promise<FoodGroupType> => {
    return foodRepository.getFoodGroupsByUser(userId);
};
