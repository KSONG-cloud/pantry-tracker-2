// CSS
import '../../styles/track_pantry/one_unit_of_food.css';

// Assets
import PlusIcon from '../../assets/icons/plus.svg';
import MinusIcon from '../../assets/icons/minus.svg';

// Types
import type { FoodUnitWithNameType } from '../../types/food';

// React stuff
import { useState } from 'react';

interface FoodUnitProps {
    food: FoodUnitWithNameType;
}

const FoodUnit = ({ food }: FoodUnitProps) => {
    const [quantity, setQuantity] = useState<number>(food.quantity);

    const handleChange = async (delta: number) => {
        if (delta <= 0 && quantity <= 0) return;
        setQuantity((prev) => prev + delta);

        // try {
        // await fetch(`/api/food/${id}`, {
        //     method: 'PATCH',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ quantity: quantity + delta }),
        // });
        // } catch (err) {
        // setQuantity(prev => prev - delta); // rollback on error
        // }
    };

    const formatDate = (label: string, date: Date) =>
        `${label}: ${date.toLocaleDateString('en-AU', { dateStyle: 'short' })}`;

    let dateText: string;

    if (food.expiry_date) {
        dateText = formatDate('Exp', food.expiry_date);
    } else if (food.bestbefore_date) {
        dateText = formatDate('Best Before', food.bestbefore_date);
    } else {
        dateText = formatDate('Added On', food.added_date);
    }

    return (
        <div className="foodUnit">
            <div className="food-icon">🥕</div>
            <div>
                <div className="food-name">{food.food_name}</div>
                <div className="food-dateinfo">
                    {dateText}
                    {/* { food.expiry_date && "Exp: " + food.expiry_date.toLocaleDateString(
                        "en-AU",
                        {
                            dateStyle: "short",
                        }    
                    )}
                    { food.expiry_date == null && food.bestbefore_date 
                        && "Best Before: " + food.bestbefore_date.toLocaleDateString(
                            "en-AU",
                            {
                                dateStyle: "short",
                            }    
                        )
                    }
                    { food.expiry_date == null && food.bestbefore_date == null 
                        && "Added On: " + food.added_date.toLocaleDateString(
                            "en-AU",
                            {
                                dateStyle: "short",
                            }    
                        )
                    } */}
                </div>
            </div>
            <div className="food-unittoggle">
                <button
                    className="food-addbutton"
                    onClick={() => handleChange(1)}
                >
                    <img src={PlusIcon} alt="Plus" />
                </button>
                <div className="food-quantity">{quantity}</div>
                <button className="food-minusbutton">
                    <img
                        src={MinusIcon}
                        alt="Minus"
                        onClick={() => handleChange(-1)}
                    />
                </button>
            </div>
        </div>
    );
};

export { FoodUnit };
