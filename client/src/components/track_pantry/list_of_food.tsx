// Components
import { FoodUnit } from './one_unit_of_food';

// Styles
import '@/styles/track_pantry/list_of_food.css';

// Types
import type { FoodUnitWithNameType } from '../../types/food';

interface FoodListProps {
    foodList: FoodUnitWithNameType[];
}

const FoodList = ({ foodList }: FoodListProps) => {
    return (
        <div className="food-list">
            {foodList.map((food) => (
                <FoodUnit key={food.id} food={food} />
            ))}
        </div>
    );
};

export { FoodList };
