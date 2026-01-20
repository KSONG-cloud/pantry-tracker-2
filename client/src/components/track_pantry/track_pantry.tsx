// Components
import { AddItemModal } from './add_item_modal';
import { FoodGroup } from './group_of_food';
import { FoodItemModal } from './food_item_modal';

// Helpers
import * as helper from '../../helpers/track_pantry.helper';

// React stuff
import { useEffect, useMemo, useRef, useState } from 'react';

// Types
import type {
    FoodUnitType,
    FoodGroupType,
    FoodEditType,
} from '../../types/food';

// Info
const USERID = 1;

function TrackPantry() {
    // Food Items and Groups State
    const [foodGroups, setFoodGroups] = useState<FoodGroupType>({});
    const [foodItems, setFoodItems] = useState<FoodUnitType[]>([]);
    const tempIdCounter = useRef(-1);

    // General State
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Food Item Modal State
    const [itemModalFoodUnit, setItemModalFoodUnit] =
        useState<FoodUnitType | null>(null);

    // Add Item Modal State
    const [addItemModalOpen, setAddItemModalOpen] = useState<boolean>(false);
    const [foodGroupId, setFoodGroupId] = useState<number>(-1);

    // Fetching Food Items and Groups from Database
    const fetchFoodItems = async () => {
        // Fetch food items from backend
        const res = await fetch(`http://localhost:3001/users/${USERID}/pantry`);
        const resJSON = await res.json();
        setFoodItems(resJSON);
        setLoading(false);
    };

    const fetchFoodGroups = async () => {
        // Fetch food groups from backend
        const res = await fetch(
            `http://localhost:3001/users/${USERID}/food-groups`
        );
        const resJSON = await res.json();
        setFoodGroups(resJSON);
    };

    // add Food Item and Group Handlers
    const addFoodItem = async (foodItem: FoodUnitType) => {
        // Logic to add food item to pantry

        // Standardise Case of food_name to Capital Case
        const normalisedFoodItem: FoodUnitType = {
            ...foodItem,
            food_name: helper.normaliseFoodName(foodItem.food_name),
        };

        // Capture previous snapshot
        const previous = foodItems;

        // Optimistically update UI
        setFoodItems((prev) => [...prev, normalisedFoodItem]);

        // Just send POST request to add item
        try {
            const res = await fetch(
                `http://localhost:3001/users/${USERID}/pantry`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(normalisedFoodItem),
                }
            );

            // If POST request fail:
            if (!res.ok) {
                // Throw Error message on failure to update
                throw new Error(
                    `Request failed: ${res.status} ${res.statusText}`
                );
            } else {
                const newItem = await res.json();
                // Replace the optimistic item with the server response (which has the real ID)
                setFoodItems((prev) =>
                    prev.map((item) =>
                        item.id === normalisedFoodItem.id ? newItem : item
                    )
                );
            }
        } catch (err) {
            // rollback
            setFoodItems(previous);
            console.error(err);
        }
    };

    const addFoodGroup = async (groupName: string) => {
        // Logic to add food group

        // How many groups in foodGroups
        const newGroupId = Object.keys(foodGroups).length + 1;
        setFoodGroups((prev) => ({ ...prev, [newGroupId]: groupName }));

        // Send POST request to backend to add food group to account
    };

    // Change Food Item and Group Handlers
    const changeFoodItem = async (edits: FoodEditType) => {
        // Standardise Case of food_name to Capital Case
        const normalisedEdits: FoodEditType = {
            ...edits,
            ...(edits.food_name !== undefined && {
                food_name: helper.normaliseFoodName(edits.food_name),
            }),
        };

        // Capture previous snapshot
        const previous = foodItems;

        // Logic to change food item in pantry
        // Optimistically update UI
        setFoodItems((prev) =>
            prev.map((item) =>
                item.id === normalisedEdits.id
                    ? { ...item, ...normalisedEdits }
                    : item
            )
        );

        // Send PATCH request to backend to update food item
        try {
            const res = await fetch(
                `http://localhost:3001/users/${USERID}/pantry/${normalisedEdits.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(normalisedEdits),
                }
            );

            // If POST request fail:
            if (!res.ok) {
                // Throw Error message on failure to update
                throw new Error(
                    `Request failed: ${res.status} ${res.statusText}`
                );
            } else {
                const newEdits = await res.json();
                // Replace the optimistic item with the server response (which has the real ID)
                setFoodItems((prev) =>
                    prev.map((item) =>
                        item.id === normalisedEdits.id
                            ? { ...item, ...newEdits }
                            : item
                    )
                );
            }
        } catch (err) {
            // rollback
            setFoodItems(previous);
            console.error(err);
        }
    };

    // Debugging useEffect
    useEffect(() => {
        // console.log('Food items changed:', foodItems);
        // console.log('Grouped food items changed:', groupFoodItems);
    }, [foodItems]);

    const changeFoodGroup = async (editedFoodGroups: FoodGroupType) => {};

    // Delete Food Item and Group Handlers
    const deleteFoodItem = async (foodId: number) => {
        setFoodItems((prev) => prev.filter((item) => item.id !== foodId));
    };

    const deleteFoodGroup = async (foodGroupId: number) => {};

    // Food Item Modal Handlers
    const openItemModal = (food: FoodUnitType) => {
        setItemModalFoodUnit(food);
    };
    const closeItemModal = () => {
        setItemModalFoodUnit(null);
    };

    const saveItemModal = async (editedFood: FoodUnitType) => {
        // Isolate edits
        const id = editedFood.id;
        const food = foodItems.find((item) => item.id === id);
        if (!food) return;
        const edits: FoodEditType = {
            ...helper.diffObject(food, editedFood),
            id: id,
        };

        // Optimistically update UI
        changeFoodItem(edits);
    };

    // Add Item Modal Handlers
    const openAddItemModal = (foodGroupId: number = -1) => {
        // THIS MIGHT NOT UPDATE FAST ENOUGH !!!!
        setFoodGroupId(foodGroupId);
        setAddItemModalOpen(true);
    };
    const closeAddItemModal = () => {
        setAddItemModalOpen(false);
    };

    // Query for food data from pantry table for user_id (Data is grouped by foodgroup_id in backend)
    // Removed = false
    // Remember to join with food table to get food names

    // Query for food group names from account table
    useEffect(() => {
        fetchFoodGroups();
        fetchFoodItems();
    }, []);

    // Group food items by their foodgroup_id
    const groupFoodItems = useMemo(() => {
        const groupedItems: Record<number, FoodUnitType[]> = {};
        foodItems.forEach((item) => {
            const groupId = item.foodgroup_id;
            groupedItems[groupId] = [...(groupedItems[groupId] || []), item];
        });
        return groupedItems;
    }, [foodItems, foodGroups]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {Object.keys(foodGroups).map((groupId) => {
                const id = Number(groupId);
                return (
                    <FoodGroup
                        key={id}
                        id={id}
                        name={foodGroups[id]}
                        list={groupFoodItems[id] || []}
                        changeFoodItem={changeFoodItem}
                        onFoodClick={openItemModal}
                        openAddItemModal={openAddItemModal}
                    />
                );
            })}

            {/* Food Item Modal */}
            {itemModalFoodUnit && (
                <FoodItemModal
                    food={itemModalFoodUnit}
                    foodGroups={foodGroups}
                    onSave={saveItemModal}
                    onDelete={deleteFoodItem}
                    onClose={closeItemModal}
                />
            )}

            {/* Add Item Modal */}
            {addItemModalOpen && (
                <AddItemModal
                    tempId={tempIdCounter.current--}
                    foodGroups={foodGroups}
                    currentGroupId={foodGroupId}
                    onClose={closeAddItemModal}
                    onAddItem={addFoodItem}
                    userId={USERID}
                    isAdding={addItemModalOpen}
                />
            )}
        </>
    );
}

export { TrackPantry };
