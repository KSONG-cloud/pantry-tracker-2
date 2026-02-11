// Import Types
import type { FreshnessLevel } from './freshness.helper';
import type { FoodUnitType } from '../types/food';

// Import Function
import { getFoodDateInfo, getTimeDiff } from './time.helper';
import { getFreshnessLevel } from './freshness.helper';

export type SortOption = 'expiry_bestbefore' | 'alpha' | 'added' | 'quantity';

export type SortDirection = 'asc' | 'desc';

export const SORTING_LABELS: Record<SortOption, string> = {
    expiry_bestbefore: 'Expiry/Best Before Date',
    alpha: 'A-Z',
    added: 'Added Date',
    quantity: 'Quantity',
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

export const applySort = (
    foodList: FoodUnitType[],
    option: SortOption,
    direction: SortDirection
): FoodUnitType[] => {
    const copy = [...foodList];
    const direction_multiplier = direction === 'asc' ? 1 : -1;

    switch (option) {
        case 'added':
            return copy.sort((a, b) => {
                const timeA = new Date(a.added_date).getTime();
                const timeB = new Date(b.added_date).getTime();

                return (timeA - timeB) * direction_multiplier;
            });

        case 'alpha':
            return copy.sort(
                (a, b) =>
                    a.food_name.localeCompare(b.food_name) *
                    direction_multiplier
            );

        case 'expiry_bestbefore':
            copy.sort((a, b) => {
                const timeA = new Date(a.added_date).getTime();
                const timeB = new Date(b.added_date).getTime();

                return (timeA - timeB) * direction_multiplier;
            });
            return copy.sort((a, b) => {
                const dateA = a.expiry_date ?? a.bestbefore_date;
                const dateB = b.expiry_date ?? b.bestbefore_date;

                let diffA = Infinity;
                let diffB = Infinity;

                if (dateA) {
                    diffA = getTimeDiff(new Date(dateA)).days;
                }
                if (dateB) {
                    diffB = getTimeDiff(new Date(dateB)).days;
                }

                return (diffA - diffB) * direction_multiplier;
            });

        case 'quantity':
            return copy.sort(
                (a, b) => (a.quantity - b.quantity) * direction_multiplier
            );

        default:
            return foodList;
    }
};
