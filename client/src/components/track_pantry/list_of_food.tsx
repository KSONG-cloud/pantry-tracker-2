// Components
import { FoodUnit } from './one_unit_of_food';

// Styles
import '@/styles/track_pantry/list_of_food.css';

// Types
import type { FoodUnitType } from '../../types/food';

interface FoodListProps {
    foodList: FoodUnitType[];
    onFoodClick: (foodItem: FoodUnitType) => void;
    changeFoodItem: (editedFood: FoodUnitType) => void;
}

const FoodList = ({ foodList, onFoodClick, changeFoodItem }: FoodListProps) => {
    return (
        <div className="food-list">
            {foodList.map((food) => (
                <FoodUnit
                    key={food.id}
                    food={food}
                    onFoodClick={onFoodClick}
                    changeFoodItem={changeFoodItem}
                />
            ))}
        </div>
    );
};

export { FoodList };
