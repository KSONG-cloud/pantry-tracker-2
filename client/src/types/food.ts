export type Food = {
    id: number;
    name: string;
};

export type FoodGroupType = {
    id: number;
    name: string;
    display_order: number;
    is_system: boolean;
};

export type FoodUnitType = {
    id: number;
    food_id: number;
    foodgroup_id: number;
    expiry_date: Date | null;
    bestbefore_date: Date | null;
    added_date: Date;
    quantity: number;
    units: string | null;
    user_id: number;
    food_name: string;
};

export type FoodEditType = Partial<FoodUnitType> & Pick<FoodUnitType, 'id'>;
