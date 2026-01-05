import { Header } from './components/header';
import { FoodUnit } from './components/track_pantry/one_unit_of_food';

// Types
import type { FoodUnitType, FoodUnitWithNameType } from './types/food';

function App() {
    const today = new Date();

    const food_names: Record<number, string> = {
        1: 'Chicken',
        2: 'Egg',
        3: 'Milk',
        4: 'Chocolate',
    };

    const food: FoodUnitType = {
        id: 1,
        food_id: 1,
        expiry_date: null,
        bestbefore_date: null,
        added_date: new Date('2024-09-08'),
        quantity: 3,
    };

    const foodList: FoodUnitType[] = [
        {
            id: 1,
            food_id: 1,
            expiry_date: null,
            bestbefore_date: null,
            added_date: new Date('2024-09-08'),
            quantity: 3,
        },
        {
            id: 3,
            food_id: 2,
            expiry_date: new Date('2025-10-08'),
            bestbefore_date: null,
            added_date: new Date('2024-07-08'),
            quantity: 5,
        },
        {
            id: 2,
            food_id: 3,
            expiry_date: null,
            bestbefore_date: new Date('2025-03-08'),
            added_date: new Date('2024-03-08'),
            quantity: 6,
        },
        {
            id: 4,
            food_id: 4,
            expiry_date: new Date('2025-12-08'),
            bestbefore_date: null,
            added_date: new Date('2024-09-08'),
            quantity: 10,
        },
    ];

    // Food names Processing
    const food_withName: FoodUnitWithNameType = {
        ...food,
        food_name: food_names[food['food_id']],
    };

    const foodList_withName: FoodUnitWithNameType[] = foodList.map((unit) => ({
        ...unit,
        food_name: food_names[unit['food_id']],
    }));

    return (
        <>
            <Header date={today}></Header>

            <FoodUnit food={food_withName}></FoodUnit>
            {foodList_withName.map((food) => (
                <FoodUnit food={food} />
            ))}
        </>
    );
}

export default App;
