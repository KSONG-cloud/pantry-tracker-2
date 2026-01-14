// Components
import { Modal, parseValue } from './modal';

// React
import { useState } from 'react';

// Styles
import '@/styles/track_pantry/food_item_modal.css';

// Types
import type { FoodUnitType } from '../../types/food';

interface FoodItemModalProps {
    food: FoodUnitType;
    foodGroups: Record<number, string>;
    onSave: (editedFood: FoodUnitType) => void;
    onDelete: (foodId: number) => void;
    onClose: () => void;
}

const FoodItemModal = ({
    food,
    foodGroups,
    onSave,
    onDelete,
    onClose,
}: FoodItemModalProps) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentFood, setCurrentFood] = useState<FoodUnitType>(food);
    const [editedFood, setEditedFood] = useState<FoodUnitType>(food);

    // Handler

    const handleChange = (key: keyof FoodUnitType, value: string) => {
        setEditedFood((prev) => ({
            ...prev,
            [key]: parseValue(key, value),
        }));
    };

    const handleClose = () => {
        // If editing, prompt to save changes
        if (isEditing) {
            const confirmClose = window.confirm(
                'You have unsaved changes. Are you sure you want to close?'
            );
            if (!confirmClose) return;
        }

        // Check if there are changes between initial food and currentFood
        const hasChanges = Object.keys(food).some((key) => {
            const k = key as keyof FoodUnitType;
            const originalValue = food[k];
            const currentValue = currentFood[k];

            // For Date comparison
            if (originalValue instanceof Date && currentValue instanceof Date) {
                return originalValue.getTime() !== currentValue.getTime();
            }

            return originalValue !== currentValue;
        });

        if (hasChanges) {
            console.log('Changes detected, saving before close.');
            onSave(currentFood);
        }

        onClose();
    };

    const handleEdit = () => {
        setIsEditing(!isEditing);
        setEditedFood(currentFood);
    };

    const handleSave = () => {
        setIsEditing(!isEditing);
        setCurrentFood(editedFood);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {/* Top-right buttons */}
                <div className="modal-header">
                    <button className="edit-button" onClick={handleEdit}>
                        {isEditing ? 'Cancel Edit' : 'Edit'}
                    </button>
                    <button
                        className="delete-button"
                        onClick={() => {
                            const confirmDelete = window.confirm(
                                'Are you sure you want to delete this item?'
                            );
                            if (confirmDelete) {
                                onDelete(currentFood.id as number);
                                onClose();
                            }
                        }}
                    >
                        Delete
                    </button>
                    <button className="close-button" onClick={handleClose}>
                        Close
                    </button>
                </div>
                <div className="modal-body">
                    <Modal
                        food={editedFood}
                        foodGroups={foodGroups}
                        onChange={handleChange}
                        isEditing={isEditing}
                    />
                    {/* Edit Save Button */}
                    {isEditing && (
                        <button className="save-button" onClick={handleSave}>
                            Save Changes
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export { FoodItemModal };
