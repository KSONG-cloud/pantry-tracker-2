type FoodMapType = {
    id: number;
    food_name: string;
};

type FoodUnitType = {
    id: number;
    food_id: number;
    group_id: number;
    expiry_date: Date | null;
    bestbefore_date: Date | null;
    added_date: Date;
    quantity: number;
    user_id: number;
    food_name: string;
    units: string | null;
};

type FoodGroupType = Record<number, string>;

export type { FoodMapType, FoodUnitType, FoodGroupType };
