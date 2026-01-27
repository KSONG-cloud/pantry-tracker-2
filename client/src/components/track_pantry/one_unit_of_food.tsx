// CSS
import '../../styles/track_pantry/one_unit_of_food.css';

// Assets
import PlusIcon from '../../assets/icons/plus.svg';
import MinusIcon from '../../assets/icons/minus.svg';

// Types
import type { FoodUnitType, FoodEditType } from '../../types/food';


// Dnd Kit
import { useDraggable } from '@dnd-kit/core';

interface FoodUnitProps {
    food: FoodUnitType;
    onFoodClick: (foodItem: FoodUnitType) => void;
    changeFoodItem: (edits: FoodEditType) => void;
    isDragging?: boolean;
}

const FoodUnit = ({
    food,
    onFoodClick,
    changeFoodItem,
    isDragging = false,
}: FoodUnitProps) => {
    const handleChange = async (delta: number) => {
        changeFoodItem({
            id: food.id,
            quantity: Math.max(0, (Number(food.quantity) || 0) + delta),
        });
    };

    const formatDate = (
        label: string,
        date: string | Date | null | undefined
    ) => {
        if (!date) return '';
        const newDate: Date = new Date(date);
        return `${label}: ${newDate.toLocaleDateString('en-AU', { dateStyle: 'short' })}`;
    };

    let dateText: string;

    if (food.expiry_date) {
        dateText = formatDate('Exp', food.expiry_date);
    } else if (food.bestbefore_date) {
        dateText = formatDate('Best Before', food.bestbefore_date);
    } else {
        dateText = formatDate('Added On', food.added_date);
    }

    // Dnd
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: food.id, // MUST be unique
        data: {
            foodGroupId: food.foodgroup_id,
        },
    });

    const style = transform
        ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
        : undefined;

    return (
        <div
            className="foodUnit"
            onClick={() => onFoodClick(food)}
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
        >
            <div className="food-icon">🥕</div>
            <div>
                <div className="food-name">{food.food_name}</div>
                <div className="food-dateinfo">{dateText}</div>
            </div>
            <div
                className="food-unittoggle"
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <button
                    className="food-addbutton"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleChange(1);
                    }}
                >
                    <img src={PlusIcon} alt="Plus" />
                </button>
                <div className="food-quantity">
                    {Number(food.quantity) || 0}
                </div>
                <button
                    className="food-minusbutton"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleChange(-1);
                    }}
                >
                    <img src={MinusIcon} alt="Minus" />
                </button>
            </div>
        </div>
    );
};

export { FoodUnit };
