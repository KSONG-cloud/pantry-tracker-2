// Components
import { AddItemModal } from './add_item_modal';
import { FoodGroup } from './group_of_food';
import { FoodItemModal } from './food_item_modal';
import { FoodUnit } from './one_unit_of_food';

// CSS Styles
import '@/styles/track_pantry/track_pantry.css';

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

// Dnd Kit
import {
    DndContext,
    DragOverlay,
    type DragEndEvent,
    type DragStartEvent,
} from '@dnd-kit/core';

// Info
const USERID = 1;

function TrackPantry() {
    // Food Items and Groups State
    const [foodGroups, setFoodGroups] = useState<FoodGroupType[]>([]);
    const [groupMap, setGroupMap] = useState<Record<number, string>>({});
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

    // Editing Food Group State
    const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
    const [tempGroupName, setTempGroupName] = useState<string>('');

    // Dnd Kit States
    const [activeFoodUnit, setActiveFoodUnit] = useState<FoodUnitType | null>(
        null
    );

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
            `http://localhost:3001/users/${USERID}/foodgroups`
        );
        const resJSON = await res.json();
        const sortedFoodGroups: FoodGroupType[] = [...resJSON].sort(
            (a, b) => a.display_order - b.display_order
        );
        setFoodGroups(sortedFoodGroups);
        const map: Record<number, string> = {};
        sortedFoodGroups.forEach((group) => {
            map[group.id] = group.name;
        });
        setGroupMap(map);
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

        // Capture previous snapshot
        const previous = foodGroups;

        // How many groups in foodGroups
        const count = foodGroups.filter(
            (group) => group.is_system === false
        ).length;
        const newFoodGroup = {
            id: tempIdCounter.current--,
            name: groupName,
            display_order: count + 1,
            is_system: false,
        };
        setFoodGroups((prev) => [...prev, newFoodGroup]);

        // Send POST request to backend to add food group
        try {
            const res = await fetch(
                `http://localhost:3001/users/${USERID}/foodgroups`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newFoodGroup),
                }
            );

            // If POST request fail:
            if (!res.ok) {
                // Throw Error message on failure to update
                throw new Error(
                    `Request failed: ${res.status} ${res.statusText}`
                );
            } else {
                const response = await res.json();
                // Replace the optimistic item with the server response (which has the real ID)
                setFoodGroups((prev) =>
                    prev.map((group) =>
                        group.id === newFoodGroup.id ? response : group
                    )
                );
            }
        } catch (err) {
            // rollback
            setFoodGroups(previous);
            console.error(err);
        }
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

            // If PATCH request fail:
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

    const editFoodGroup = async (id: number, name: string) => {
        console.log('foodGroups', foodGroups);
        console.log('edited group', id, name);
        setEditingGroupId(id);
        setTempGroupName(name);
    };

    // Delete Food Item and Group Handlers
    const deleteFoodItem = async (foodId: number) => {
        // Capture previous snapshot
        const previous = foodItems;

        // Optimistically update UI
        setFoodItems((prev) => prev.filter((item) => item.id !== foodId));

        // Just send PATCH request to add item
        try {
            const res = await fetch(
                `http://localhost:3001/users/${USERID}/pantry/${foodId}/delete`,
                {
                    method: 'PATCH',
                }
            );

            // If PATCH request fail:
            if (!res.ok) {
                // Throw Error message on failure to update
                throw new Error(
                    `Request failed: ${res.status} ${res.statusText}`
                );
            }
        } catch (err) {
            // rollback
            setFoodItems(previous);
            console.error(err);
        }
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

    // Dnd Kit Handlers
    const handleDragStart = (event: DragStartEvent) => {
        const food = foodItems.find(
            (foodItem) => foodItem.id === event.active.id
        );
        setActiveFoodUnit(food ?? null);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        const foodItemId = Number(active.id);
        const newFoodGroupId = Number(over.id);

        changeFoodItem({ id: foodItemId, foodgroup_id: newFoodGroupId });

        setActiveFoodUnit(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                {foodGroups
                    .filter((foodGroup) =>
                        foodGroup.is_system
                            ? Object.keys(groupFoodItems).includes(
                                  String(foodGroup.id)
                              )
                            : true
                    )
                    .map((foodGroup) => {
                        const id = Number(foodGroup.id);
                        const name = foodGroup.name;
                        return (
                            <FoodGroup
                                key={id}
                                id={id}
                                name={name}
                                list={groupFoodItems[id] || []}
                                changeFoodItem={changeFoodItem}
                                onFoodClick={openItemModal}
                                openAddItemModal={openAddItemModal}
                                editFoodGroup={editFoodGroup}
                                // tempGroupName={tempGroupName}
                                // setTempGroupName={setTempGroupName}
                            />
                        );
                    })}

                <DragOverlay>
                    {activeFoodUnit ? (
                        <FoodUnit
                            key={activeFoodUnit.id}
                            food={activeFoodUnit}
                            onFoodClick={() => {}}
                            changeFoodItem={async () => {}}
                            isDragging
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>
            {/* Food Item Modal */}
            {itemModalFoodUnit && (
                <FoodItemModal
                    food={itemModalFoodUnit}
                    foodGroups={groupMap}
                    onSave={saveItemModal}
                    onDelete={deleteFoodItem}
                    onClose={closeItemModal}
                />
            )}

            {/* Add Item Modal */}
            {addItemModalOpen && (
                <AddItemModal
                    tempId={tempIdCounter.current--}
                    foodGroups={groupMap}
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
