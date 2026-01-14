export type Food = {
    id: number;
    name: string;
};

export type FoodGroupType = Record<number, string>;

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

// export type FoodUnitDraftType = {
//     id: number;
//     food_id: number;
//     foodgroup_id: number;
//     expiry_date: Date | null;
//     bestbefore_date: Date | null;
//     added_date: Date;
//     quantity: number;
//     units: string | null;
//     user_id: number;
//     food_name: string;
// };
