import { Header } from './components/header';
import { FoodUnit } from './components/track_pantry/one_unit_of_food';

// Types
import type { FoodUnitWithNameType } from './types/food';

// Info
import { food_groups, food_names, foodList } from './info';

function App() {
    const today = new Date();

    // Food names Processing - In the future might use Context to process it in One_unit_of_food
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
