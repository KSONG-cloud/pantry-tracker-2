// Components
import { FoodList } from './list_of_food';

// Dnd Kit
import { useDroppable } from '@dnd-kit/core';

// React

// Styles
import '@/styles/track_pantry/group_of_food.css';

// Types
import type {
    FoodUnitType,
    FoodEditType,
} from '../../types/food';

interface FoodGroupProps {
    id: number;
    name: string;
    list: FoodUnitType[];
    changeFoodItem: (edits: FoodEditType) => void;
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
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    const style = {
        color: isOver ? 'green' : undefined,
    };

    return (
        <div className="foodgroup-container" ref={setNodeRef} style={style}>
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
