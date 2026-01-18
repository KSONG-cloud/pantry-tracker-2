import * as foodRepository from '../database/food.repository.js';
import type {
    FoodMapType,
    FoodUnitType,
    FoodGroupType,
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

export const addFoodItemPantry = async (
    item: FoodUnitType
): Promise<FoodUnitType> => {
    // Check if food exists in food
    // // Fetch food from food table
    const foodMapList = await foodRepository.getFoodMap();
    const foodMap: Record<number, string> = foodMapList.reduce(
        (acc, row) => {
            acc[row.id] = row.food_name;
            return acc;
        },
        {} as Record<number, string>
    );

    const normalisedFoodName = item.food_name?.toLowerCase();
    // // Check item food_name again all food in lowercase
    let foodId =
        Number(
            Object.keys(foodMap).find(
                (key) =>
                    foodMap[Number(key)]?.toLowerCase() === normalisedFoodName
            )
        ) ?? null;
    // let foodId: number | null = foodMap.get(normalised) ?? null;
    // // If not:
    if (!foodId) {
        // // // Insert into food table and retrieve corresponding food_id
        const food: FoodMapType = await foodRepository.addFood(item.food_name);
        foodId = food.id;
    }
    // // If yes, we already know the foodId

    // // Replace temporary food_id (probably -1) with retrieved food_id
    const checkedItem = { ...item, food_id: foodId };

    // Now that we have a food_id, insert food item into pantry
    const addedItem = foodRepository.addFoodItemPantry(checkedItem);

    return addedItem;
};

// Account/Food Group
export const getFoodGroupsByUser = async (
    userId: number
): Promise<FoodGroupType> => {
    return foodRepository.getFoodGroupsByUser(userId);
};
