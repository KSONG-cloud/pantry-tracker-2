// CSS
import '../../styles/track_pantry/one_unit_of_food.css';

// Lucide
import { Plus, Minus } from 'lucide-react';

// Types
import type { FoodUnitType, FoodEditType } from '../../types/food';
import type { FreshnessLevel } from '../../helpers/freshness.helper';

// Dnd Kit
import { useDraggable } from '@dnd-kit/core';

// Helpers
import {
    formatRelativeDate,
    formatAbsoluteDate,
} from '../../helpers/time.helper';

import {
    getFreshnessLevel,
    freshnessColors,
} from '../../helpers/freshness.helper';

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

    let dateText: string = '';
    let freshnessLevel: FreshnessLevel;
    let dateActual: string = '';

    if (food.expiry_date) {
        dateText = formatRelativeDate(new Date(food.expiry_date), 'expiry');
        freshnessLevel = getFreshnessLevel(
            new Date(food.expiry_date),
            'expiry'
        );
        dateActual = formatAbsoluteDate(new Date(food.expiry_date), 'expiry');
    } else if (food.bestbefore_date) {
        dateText = formatRelativeDate(
            new Date(food.bestbefore_date),
            'bestbefore'
        );
        freshnessLevel = getFreshnessLevel(
            new Date(food.bestbefore_date),
            'bestbefore'
        );
        dateActual = formatAbsoluteDate(
            new Date(food.bestbefore_date),
            'bestbefore'
        );
    } else {
        dateText = formatRelativeDate(new Date(food.added_date), 'added');
        freshnessLevel = getFreshnessLevel(new Date(food.added_date), 'added');
        dateActual = formatAbsoluteDate(new Date(food.added_date), 'added');
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
            className={`food-unit ${isDragging ? 'dragging' : ''}`}
            onClick={() => onFoodClick(food)}
            ref={setNodeRef}
            style={style}
        >
            {/* Drag Handle */}
            <div
                className={`drag-handle ${isDragging ? 'dragging' : ''}`}
                {...listeners}
                {...attributes}
                onClick={(e) => e.stopPropagation()}
            >
                ⠿
            </div>
            <div className="food-content">
                <div className="food-icon">🥕</div>
                <div>
                    <div
                        className="food-name"
                        style={{ color: freshnessColors[freshnessLevel] }}
                    >
                        {food.food_name}
                    </div>
                    <div className="food-datewrapper">
                        <div
                            // title="Expiring on 23 Dec 2026"
                            className="food-dateinfo"
                            style={{ color: freshnessColors[freshnessLevel] }}
                        >
                            {dateText}
                        </div>
                        <div className="food-datetooltip">{dateActual}</div>
                    </div>
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
                        <Plus className='food-addbutton-icon'/>
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
                        <Minus className='food-minusbutton-icon'/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export { FoodUnit };
