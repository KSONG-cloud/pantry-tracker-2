type food = {
    id: number;
    name: string;
}


type newFoodUnitType = {
    id: number;
    food_id: number;
    group_id: number;
    expiry_date: Date | null;
    bestbefore_date: Date | null;
    added_date: Date;
    quantity: number;
    user_id: number;
    food_name: string;
};


export type { food, newFoodUnitType };