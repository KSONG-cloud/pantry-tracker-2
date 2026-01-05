// Components
import { FoodList } from './list_of_food';

// React
import { useState } from 'react';

// Styles
import '@/styles/track_pantry/group_of_food.css';

// Types
import type { FoodUnitWithNameType } from '../../types/food';

interface FoodGroupProps {
    name: string;
    list: FoodUnitWithNameType[];
}

const FoodGroup = ({ name, list }: FoodGroupProps) => {
    const [foodList, setFoodList] = useState<FoodUnitWithNameType[]>(list);

    const handleAddItem = () => {
        // Logic to add a new food item to the group
        // This could involve opening a modal or redirecting to an add item page
        console.log(`Add item to group ${name}`);
    };

    return (
        <div className="foodgroup-container">
            <div className="foodgroup-header">
                <div className="foodgroup-icon"></div>
                <span className="foodgroup-name">{name}</span>
                <button
                    className="foodgroup-add-button"
                    onClick={handleAddItem}
                >
                    ADD ITEM
                </button>
                <div className="foodgroup-line"></div>
            </div>
            <FoodList foodList={foodList} />
        </div>
    );
};

export { FoodGroup };
