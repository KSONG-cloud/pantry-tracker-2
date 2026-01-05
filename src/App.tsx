import { Header } from './components/header';
import { FoodGroup } from './components/track_pantry/group_of_food';

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

    const groupedFoods: Record<number, FoodUnitWithNameType[]> =
        foodList_withName.reduce<Record<number, FoodUnitWithNameType[]>>(
            (acc, food) => {
                if (!acc[food.group_id]) {
                    acc[food.group_id] = [];
                }
                acc[food.group_id].push(food);
                return acc;
            },
            {}
        );

    return (
        <>
            <Header date={today}></Header>

            {Object.keys(food_groups).map((groupId) => {
                const id = Number(groupId);
                return (
                    <FoodGroup
                        key={food_groups[id]}
                        name={food_groups[id]}
                        list={groupedFoods[id] || []}
                    />
                );
            })}
        </>
    );
}

export default App;
