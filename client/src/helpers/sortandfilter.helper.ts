// Import Types
import type { FreshnessLevel } from './freshness.helper';
import type { FoodUnitType } from '../types/food';

// Import Function
import { getFoodDateInfo } from './time.helper';
import { getFreshnessLevel } from './freshness.helper';

export type SortOption = 'expiry' | 'alpha' | 'added' | 'quantity';

export type SortDirection = 'asc' | 'desc';

export const SORTING_LABELS: Record<SortOption, string> = {
    expiry: 'Expiry (Asc)',
    alpha: 'A-Z',
    added: 'Added Date (Asc)',
    quantity: 'Quantity (Asc)',
};

export const applyFreshnessFilter = (
    foodList: FoodUnitType[],
    freshnessFilter: FreshnessLevel[]
): FoodUnitType[] => {
    return foodList.filter((food) => {
        const dateInfo = getFoodDateInfo(food);
        return freshnessFilter.includes(
            getFreshnessLevel(dateInfo.date, dateInfo.type)
        );
    });
};

export const applySearch = (
    foodList: FoodUnitType[],
    query: string
): FoodUnitType[] => {
    const trim = query.trim();

    if (!trim) return foodList;

    const lower = trim.toLowerCase();

    return foodList.filter((food) =>
        food.food_name.toLowerCase().includes(lower)
    );
};
