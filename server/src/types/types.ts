export type FoodMapType = {
    id: number;
    food_name: string;
};

export type FoodUnitType = {
    id: number;
    food_id: number;
    foodgroup_id: number;
    expiry_date: Date | null;
    bestbefore_date: Date | null;
    added_date: Date;
    quantity: number;
    user_id: number;
    food_name: string;
    units: string | null;
};

export type FoodGroupType = Record<number, string>;

export type PantryRow = Partial<{
    id: number;
    food_id: number;
    foodgroup_id: number;
    expiry_date: Date | null;
    bestbefore_date: Date | null;
    added_date: Date;
    quantity: number;
    user_id: number;
    units: string | null;
}>;

export type PantryEdit = PantryRow & Partial<{ food_name: string }>;
