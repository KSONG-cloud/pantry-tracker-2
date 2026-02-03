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

export type FoodGroupRow = {
    id: number;
    user_id: number;
    name: string;
    display_order: number;
    is_system: boolean;
    created_at: Date;
    updated_at: Date;
};

export type FoodGroupType = Partial<FoodGroupRow>;

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
