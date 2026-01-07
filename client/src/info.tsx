// Types
import type { FoodUnitType } from './types/food';

const food_groups: Record<number, string> = {
    1: 'Fruits',
    2: 'Vegetables',
    3: 'Dairy',
    4: 'Snacks',
    5: 'Grains',
    6: 'Proteins',
};

const food_names: Record<number, string> = {
    1: 'Chicken',
    2: 'Egg',
    3: 'Milk',
    4: 'Chocolate',
};

const food: FoodUnitType = {
    id: 1,
    food_id: 1,
    group_id: 6,
    expiry_date: null,
    bestbefore_date: null,
    added_date: new Date('2024-09-08'),
    quantity: 3,
};

const foodList: FoodUnitType[] = [
    {
        id: 1,
        food_id: 1,
        group_id: 6,
        expiry_date: null,
        bestbefore_date: null,
        added_date: new Date('2024-09-08'),
        quantity: 3,
    },
    {
        id: 3,
        food_id: 2,
        group_id: 6,
        expiry_date: new Date('2025-10-08'),
        bestbefore_date: null,
        added_date: new Date('2024-07-08'),
        quantity: 5,
    },
    {
        id: 2,
        food_id: 3,
        group_id: 3,
        expiry_date: null,
        bestbefore_date: new Date('2025-03-08'),
        added_date: new Date('2024-03-08'),
        quantity: 6,
    },
    {
        id: 4,
        food_id: 4,
        group_id: 4,
        expiry_date: new Date('2025-12-08'),
        bestbefore_date: null,
        added_date: new Date('2024-09-08'),
        quantity: 10,
    },
    {
        id: 5,
        food_id: 4,
        group_id: 4,
        expiry_date: new Date('2025-12-08'),
        bestbefore_date: null,
        added_date: new Date('2024-09-08'),
        quantity: 10,
    },
    {
        id: 6,
        food_id: 4,
        group_id: 4,
        expiry_date: new Date('2025-12-08'),
        bestbefore_date: null,
        added_date: new Date('2024-09-08'),
        quantity: 10,
    },
    {
        id: 7,
        food_id: 4,
        group_id: 4,
        expiry_date: new Date('2025-12-08'),
        bestbefore_date: null,
        added_date: new Date('2024-09-08'),
        quantity: 10,
    },
    {
        id: 8,
        food_id: 4,
        group_id: 4,
        expiry_date: new Date('2025-12-08'),
        bestbefore_date: null,
        added_date: new Date('2024-09-08'),
        quantity: 10,
    },
];

export { food_groups, food_names, food, foodList };
