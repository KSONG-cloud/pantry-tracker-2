export type FoodUnitType = {
    id: number;
    food_id: number;
    expiry_date: Date | null;
    bestbefore_date: Date | null;
    added_date: Date;
    quantity: number;
};

export type FoodUnitWithNameType = FoodUnitType & {
    food_name: string;
};
