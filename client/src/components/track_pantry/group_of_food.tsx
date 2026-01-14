// Components
import { FoodList } from './list_of_food';

// React

// Styles
import '@/styles/track_pantry/group_of_food.css';

// Types
import type { FoodUnitType } from '../../types/food';

interface FoodGroupProps {
    id: number;
    name: string;
    list: FoodUnitType[];
    changeFoodItem: (editedFood: FoodUnitType) => void;
    onFoodClick: (foodItem: FoodUnitType) => void;
    openAddItemModal: (groupId: number) => void;
}

const FoodGroup = ({
    id,
    name,
    list,
    changeFoodItem,
    onFoodClick,
    openAddItemModal,
}: FoodGroupProps) => {
    return (
        <div className="foodgroup-container">
            <div className="foodgroup-header">
                <div className="foodgroup-icon"></div>
                <span className="foodgroup-name">{name}</span>
                <button
                    className="foodgroup-add-button"
                    onClick={() => openAddItemModal(id)}
                >
                    ADD ITEM
                </button>
                <div className="foodgroup-line"></div>
            </div>
            <FoodList
                foodList={list}
                onFoodClick={onFoodClick}
                changeFoodItem={changeFoodItem}
            />
        </div>
    );
};

export { FoodGroup };
