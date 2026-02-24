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
    editFoodGroup: (id: number, name: string) => void;
    handleSaveFoodGroup: (id: number) => void;
    shiftFoodGroup: (id: number, direction: 'up' | 'down') => void;
    deleteFoodGroup: (id: number) => void;
    tempGroupName: string;
    setTempGroupName: (name: string) => void;
    isEditing: boolean;
    is_system: boolean;
}

const FoodGroup = ({
    id,
    name,
    list,
    changeFoodItem,
    onFoodClick,
    openAddItemModal,
    editFoodGroup,
    handleSaveFoodGroup,
    shiftFoodGroup,
    deleteFoodGroup,
    tempGroupName,
    setTempGroupName,
    isEditing,
    is_system,
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
                {isEditing ? (
                    <input
                        type="text"
                        value={tempGroupName}
                        autoFocus
                        onChange={(e) => setTempGroupName(e.target.value)}
                        onBlur={() => handleSaveFoodGroup(id)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveFoodGroup(id);
                        }}
                    />
                ) : (
                    <span className="foodgroup-name">{name}</span>
                )}
                {/* <span className="foodgroup-name">{name}</span> */}
                <button
                    className="foodgroup-additem-button"
                    onClick={() => openAddItemModal(id)}
                >
                    ADD ITEM
                </button>
                {!is_system && (
                    <>
                        <button
                            className="foodgroup-edit-button"
                            onClick={() => {
                                editFoodGroup(id, name);
                            }}
                        >
                            EDIT
                        </button>
                        <button
                            className="foodgroup-delete-button"
                            onClick={() => deleteFoodGroup(id)}
                        >
                            DELETE
                        </button>
                    </>
                )}

                <div className="foodgroup-line"></div>

                <div
                    className={`foodgroup arrow up`}
                    onClick={() => shiftFoodGroup(id, 'up')}
                >
                    ▲
                </div>
                <div
                    className={`foodgroup arrow down`}
                    onClick={() => shiftFoodGroup(id, 'down')}
                >
                    ▼
                </div>
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
