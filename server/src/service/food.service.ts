import * as foodRepository from '../database/food.repository.js';
import type {
    FoodMapType,
    FoodUnitType,
    FoodGroupType,
    PantryRow,
    PantryEdit,
} from '../types/types.js';

// Food
export const getFoodMap = async (): Promise<FoodMapType[]> => {
    return foodRepository.getFoodMap();
};

// Pantry
export const getPantryByUser = async (
    userId: number
): Promise<FoodUnitType[]> => {
    // Business logic lives here
    // (e.g. permissions, transformations later)

    // Should process it here to FoodMapType

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

export const patchFoodItemPantry = async (
    userId: number,
    pantryId: number,
    edits: PantryEdit
): Promise<PantryEdit> => {
    // Error if no updates are provided
    const editsKeys: string[] = Object.keys(edits);
    if (editsKeys.length === 0) throw new Error('No updates provided');

    let updates: PantryRow;

    // One Caveat: if food_name changed, we have to check if the name is in food table already or not
    if (editsKeys.includes('food_name')) {
        // Extract food_name from updates
        const { food_name, ...restEdits } = edits;

        // Handle food_name update - check if it exists in food table
        const foodMapList = await foodRepository.getFoodMap();
        const foodMap: Record<number, string> = foodMapList.reduce(
            (acc, row) => {
                acc[row.id] = row.food_name;
                return acc;
            },
            {} as Record<number, string>
        );

        const normalisedFoodName = food_name?.toLowerCase();
        let foodId =
            Number(
                Object.keys(foodMap).find(
                    (key) =>
                        foodMap[Number(key)]?.toLowerCase() ===
                        normalisedFoodName
                )
            ) ?? null;

        if (!foodId) {
            const food: FoodMapType = await foodRepository.addFood(
                food_name as string
            );
            foodId = food.id;
        }

        // Update updates with food_id and remove food_name
        updates = { ...restEdits, food_id: foodId };
    } else {
        updates = { ...edits };
    }

    const keys: string[] = Object.keys(updates);

    const setClause = keys.map((k, idx) => `${k} = $${idx + 1}`).join(', ');
    const values = Object.values(updates);
    const update_length = keys.length;

    // Update food item in pantry
    const updatedFoodItem = foodRepository.patchFoodItemPantry(
        userId,
        pantryId,
        setClause,
        values,
        update_length
    );

    return updatedFoodItem;
};

export const deletePantryByUser = async (pantryId: number) => {
    return foodRepository.deletePantry(pantryId);
};

// Food Group
export const getFoodGroupsByUser = async (userId: number) => {
    return foodRepository.getFoodGroupsByUser(userId);
};

export const addFoodGroupsByUser = async (
    userId: number,
    group: FoodGroupType
) => {
    return foodRepository.addFoodGroupsByUser(userId, group);
}

// Account