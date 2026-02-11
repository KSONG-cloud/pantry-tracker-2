// Import Types
import type { FreshnessLevel } from './freshness.helper';
import type { FoodUnitType } from '../types/food';

// Import Function
import { getFoodDateInfo } from './time.helper';
import { getFreshnessLevel } from './freshness.helper';

export type SortOption =
    | 'expiry_asc'
    | 'expiry_dsc'
    | 'alpha_asc'
    | 'alpha_dsc'
    | 'added_asc'
    | 'added_dsc'
    | 'quantity_asc'
    | 'quantity_dsc';

export const applyFreshnessFilter = (
    foodList: FoodUnitType[],
    freshnessFilter: FreshnessLevel[]
) => {
    return foodList.filter((food) => {
        const dateInfo = getFoodDateInfo(food);
        return freshnessFilter.includes(
            getFreshnessLevel(dateInfo.date, dateInfo.type)
        );
    });
};
