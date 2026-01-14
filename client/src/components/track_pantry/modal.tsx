// Types
import type { FoodUnitType } from '../../types/food';
// import type { FoodUnitDraftType } from '../../types/food';

/*
    Modal.tsx
    - Reusable field-driven modal template used by AddItemModal and FoodItemModal.
    - This file defines a Field config shape and a `fields` array which drives the
    rendered inputs. The component maps over `fields` and renders either an
    input/select (when editing is allowed) or a display value.

    Expected props (documented here; the concrete ModalProps interface is left
    commented because this file is used as a template and the exact prop shape
    is provided by the wrapping modal components):
    - editedFood: FoodUnitType        // current values to render/edit
    - foodGroups: Record<number,string>// group id => group name map (for selects)
    - isEditing: boolean              // whether inputs should be editable
    - handleChange: (key, value) => void // called when an input changes

    Notes:
    - Date fields expect ISO-ish strings or Date objects and are normalized
        for display and input values.
    - The `formatDisplay` and `formatDate` helpers on each Field control
        how values are shown when not editable.
*/

// type ModalProps = {
interface ModalProps {
    food: FoodUnitType;
    foodGroups: Record<number, string>;
    onChange: (key: keyof FoodUnitType, value: string) => void;
    isEditing?: boolean;
    isAdding?: boolean;
    tempId?: number;
}
// } | {
//     food: FoodUnitDraftType;
//     foodGroups: Record<number, string>;
//     onChange: (key: keyof FoodUnitType, value: string) => void;
//     onClose: () => void;
//     isEditing: boolean;
//     isAdding: boolean;
//     tempId?: number;
// }

const Modal = ({
    food,
    foodGroups,
    onChange,
    isEditing,
    isAdding,
    tempId,
}: ModalProps) => {
    // Fields
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

    return (
        <>
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
                    const value = food[key];
                    let dateValue: string = '';
                    if (type === 'date' && value !== null) {
                        const tempDate = new Date(value);
                        dateValue = formatDate
                            ? formatDate(tempDate)
                            : value.toString();
                    }

                    const display: React.ReactNode = formatDisplay(value);

                    // Compute Input Element
                    let inputElement: React.ReactNode = null;
                    if ((isEditing || isAdding) && key !== 'added_date') {
                        if (type === 'select' && key === 'foodgroup_id') {
                            inputElement = (
                                <select
                                    className="modal-field-input"
                                    value={value ? value.toString() : ''}
                                    required={required ?? false}
                                    onChange={(e) =>
                                        onChange(key, e.target.value)
                                    }
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
                                        dateValue ? dateValue.toString() : ''
                                    }
                                    type={type ?? 'text'}
                                    required={required ?? false}
                                    min={min}
                                    onChange={(e) =>
                                        onChange(key, e.target.value)
                                    }
                                />
                            );
                        } else {
                            inputElement = (
                                <input
                                    className="modal-field-input"
                                    value={value ? value.toString() : ''}
                                    type={type ?? 'text'}
                                    required={required ?? false}
                                    min={min}
                                    onChange={(e) =>
                                        onChange(key, e.target.value)
                                    }
                                />
                            );
                        }
                    }

                    return (
                        <div className="modal-field" key={key}>
                            <span className="modal-field-label">{label}: </span>
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
        </>
    );
};

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

export { Modal, parseValue };
