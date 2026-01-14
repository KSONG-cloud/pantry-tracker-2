// Components
import { Modal, parseValue } from './modal';

// React
import { useState } from 'react';

// Styles
import '@/styles/track_pantry/food_item_modal.css';

// Types
import type { FoodUnitType, FoodGroupType } from '../../types/food';

interface AddItemModalProps {
    tempId: number;
    foodGroups: FoodGroupType;
    currentGroupId?: number;
    onClose: () => void;
    onAddItem: (newFood: FoodUnitType) => void;
    userId: number;
    isAdding: boolean;
}

const AddItemModal = ({
    tempId,
    foodGroups,
    currentGroupId,
    onClose,
    onAddItem,
    userId,
    isAdding,
}: AddItemModalProps) => {
    const [newFood, setNewFood] = useState({
        id: tempId,
        food_name: '',
        quantity: 0,
        foodgroup_id: currentGroupId ? currentGroupId : -1,
        added_date: new Date(),
        expiry_date: null,
        bestbefore_date: null,
        units: null,
        food_id: -1,
        user_id: userId,
    });

    const handleChange = (key: keyof FoodUnitType, value: string) => {
        setNewFood((prev) => ({
            ...prev,
            [key]: parseValue(key, value),
        }));
    };

    const handleSave = () => {
        onAddItem(newFood);
        onClose();
        return;
    };

    const handleClose = () => {
        const confirmClose = window.confirm(
            'You have unsaved changes. Are you sure you want to close?'
        );
        if (!confirmClose) return;

        onClose();
        return;
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <button className="close-button" onClick={handleClose}>
                        Close
                    </button>
                </div>
                <div className="modal-body">
                    <Modal
                        food={newFood}
                        foodGroups={foodGroups}
                        onChange={handleChange}
                        isAdding={isAdding}
                    />
                </div>
                <button className="save-button" onClick={handleSave}>
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export { AddItemModal };
