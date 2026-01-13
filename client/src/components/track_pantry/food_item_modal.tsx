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

    type Field<T> = {
        label: string;
        key: keyof T;
        type?: 'text' | 'number' | 'date' | 'select';
        required?: boolean;
        min?: number;
        formatDisplay: (val: T[keyof T]) => string | number;
        formatDate?: (val: Date) => string;
    };

    const fields: Field<FoodUnitType>[] = [
        {
            label: 'Name',
            key: 'food_name',
            type: 'text',
            formatDisplay: (val) => (val ? val.toString() : '-'),
            required: true,
        },
        {
            label: 'Quantity',
            key: 'quantity',
            type: 'number',
            formatDisplay: (val) => (val ? val.toString() : '-'),
            required: true,
            min: 0,
        },
        {
            label: 'Units',
            key: 'units',
            type: 'text',
            formatDisplay: (val) => (val ? val.toString() : '-'),
        },
        {
            label: 'Group',
            key: 'foodgroup_id',
            type: 'select',
            formatDisplay: (val) => (val ? foodGroups[val as number] : '-'),
        },
        {
            label: 'Added Date',
            key: 'added_date',
            type: 'date',
            formatDate: (val) => val.toISOString().slice(0, 10),
            formatDisplay: (val) =>
                val ? new Date(val).toLocaleDateString() : '-',
        },
        {
            label: 'Best Before',
            key: 'bestbefore_date',
            type: 'date',
            formatDate: (val) => val.toISOString().slice(0, 10),
            formatDisplay: (val) =>
                val ? new Date(val).toLocaleDateString() : '-',
        },
        {
            label: 'Expiry Date',
            key: 'expiry_date',
            type: 'date',
            formatDate: (val) => val.toISOString().slice(0, 10),
            formatDisplay: (val) =>
                val ? new Date(val).toLocaleDateString() : '-',
        },
    ];

    // Helper Functions
    const parseValue = (key: keyof FoodUnitType, value: string) => {
        if (value === '') return null;

        switch (key) {
            case 'quantity':
                return Number(value);

            case 'bestbefore_date':
            case 'expiry_date':
            case 'added_date':
                return new Date(value);

            default:
                return value;
        }
    };

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
        // Here you would typically also handle saving the edited data to a server or state management
        console.log('Saved Food Item:', editedFood);
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
                    {fields.map(
                        ({
                            label,
                            key,
                            type,
                            required,
                            formatDate,
                            formatDisplay,
                            min,
                        }) => {
                            // Values and display
                            const value = editedFood[key];
                            let dateValue = '';
                            if (type === 'date' && value !== null) {
                                const tempDate = new Date(value);
                                dateValue = formatDate
                                    ? formatDate(tempDate)
                                    : value.toString();
                            }

                            const display: React.ReactNode =
                                formatDisplay(value);

                            // Compute Input Element
                            let inputElement: React.ReactNode = null;
                            if (isEditing && key !== 'added_date') {
                                if (
                                    type === 'select' &&
                                    key === 'foodgroup_id'
                                ) {
                                    inputElement = (
                                        <select
                                            className="modal-field-input"
                                            value={
                                                value ? value.toString() : ''
                                            }
                                            required={required ?? false}
                                            onChange={(e) =>
                                                handleChange(
                                                    key,
                                                    e.target.value
                                                )
                                            }
                                            // options: foodGroups.map((groupName, groupId) => (<option key={groupId} value={groupId}>{groupName}</option>)
                                        >
                                            {Object.entries(foodGroups).map(
                                                ([groupId, groupName]) => (
                                                    <option
                                                        key={groupId}
                                                        value={groupId}
                                                    >
                                                        {groupName}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    );
                                } else if (type === 'date') {
                                    inputElement = (
                                        <input
                                            className="modal-field-input"
                                            value={
                                                dateValue
                                                    ? dateValue.toString()
                                                    : ''
                                            }
                                            type={type ?? 'text'}
                                            required={required ?? false}
                                            min={min}
                                            onChange={(e) =>
                                                handleChange(
                                                    key,
                                                    e.target.value
                                                )
                                            }
                                        />
                                    );
                                } else {
                                    inputElement = (
                                        <input
                                            className="modal-field-input"
                                            value={
                                                value ? value.toString() : ''
                                            }
                                            type={type ?? 'text'}
                                            required={required ?? false}
                                            min={min}
                                            onChange={(e) =>
                                                handleChange(
                                                    key,
                                                    e.target.value
                                                )
                                            }
                                        />
                                    );
                                }
                            }

                            return (
                                <div className="modal-field" key={key}>
                                    <span className="modal-field-label">
                                        {label}:{' '}
                                    </span>
                                    {inputElement ? (
                                        inputElement
                                    ) : (
                                        <span className="modal-field-value">
                                            {display}
                                        </span>
                                    )}
                                </div>
                            );
                        }
                    )}

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
