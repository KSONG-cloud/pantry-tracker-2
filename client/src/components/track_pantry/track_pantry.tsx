// APIs
import * as pantryAPI from '../../api/pantry.api';
import * as foodgroupAPI from '../../api/foodgroup.api';

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
        const res = await pantryAPI.getPantry(USERID);
        setFoodItems(res);
        setLoading(false);
    };

    const fetchFoodGroups = async () => {
        // Fetch food groups from backend
        const res = await foodgroupAPI.getFoodGroups(USERID);
        const sortedFoodGroups: FoodGroupType[] = [...res].sort(
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
            const newItem: FoodUnitType = await pantryAPI.addFoodItem(
                USERID,
                normalisedFoodItem
            );
            // Replace the optimistic item with the server response (which has the real ID)
            setFoodItems((prev) =>
                prev.map((item) =>
                    item.id === normalisedFoodItem.id ? newItem : item
                )
            );
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
            (group) => !group.is_system 
        ).length;
        const tempFoodGroup = {
            id: tempIdCounter.current--,
            name: groupName,
            display_order: count + 1,
            is_system: false,
        };
        setFoodGroups((prev) => [...prev, tempFoodGroup]);

        // Send POST request to backend to add food group
        try {
            const newFoodGroup = await foodgroupAPI.addFoodGroup(
                USERID,
                tempFoodGroup
            );
            setFoodGroups((prev) =>
                prev.map((group) =>
                    group.id === tempFoodGroup.id ? newFoodGroup : group
                )
            );
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
            const newEdits = await pantryAPI.changeFoodItem(
                USERID,
                normalisedEdits
            );
            // Replace the optimistic item with the server response (which has the real ID)
            setFoodItems((prev) =>
                prev.map((item) =>
                    item.id === normalisedEdits.id
                        ? { ...item, ...newEdits }
                        : item
                )
            );
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
            pantryAPI.deleteFoodItem(USERID, foodId);
        } catch (err) {
            // rollback
            setFoodItems(previous);
            console.error(err);
        }
    };

    const deleteFoodGroup = async (foodGroupId: number) => {
        // Can't delete Unassigned
        if (foodGroupId === unassignedId) {
            throw new Error('Cannot delete unassigned');
        }

        // Capture previous snapshot
        const previousGroup = foodGroups;
        const previousFood = foodItems;

        // Isolate the food group getting removed
        const removedFoodGroup = foodGroups.find(
            (group) => group.id === foodGroupId
        );

        if (!removedFoodGroup) {
            throw new Error('Food Group not found.');
        }

        // Handle food items in the removed food groups - put them all in Unassigned
        const itemsToMove = foodItems.filter(
            (item) => item.foodgroup_id === removedFoodGroup.id
        );

        // React state update
        setFoodItems((prev) =>
            prev.map((item) =>
                item.foodgroup_id === removedFoodGroup.id
                    ? { ...item, foodgroup_id: unassignedId }
                    : item
            )
        );

        // Removed group
        setFoodGroups((prev) =>
            prev.filter((group) => group.id !== foodGroupId)
        );

        // Reset display_order
        setFoodGroups((prev) =>
            prev.map((group) =>
                !group.is_system &&
                group.display_order >= removedFoodGroup.display_order
                    ? { ...group, display_order: group.display_order - 1 }
                    : group
            )
        );

        try {
            // API updates
            // API: Move items to unassigned
            await Promise.all(
                itemsToMove.map((item) =>
                    pantryAPI.changeFoodItem(USERID, {
                        id: item.id,
                        foodgroup_id: unassignedId,
                    })
                )
            );

            // API: Delete food group (includes reorder)
            const newFoodGroups = await foodgroupAPI.deleteFoodGroup(
                USERID,
                removedFoodGroup.id
            );
            // Update state with current data from database after delete
            setFoodGroups(newFoodGroups);
        } catch (err) {
            // rollback
            setFoodItems(previousFood);
            setFoodGroups(previousGroup);
            console.error(err);
        }
    };

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
            <div className="main-content">
                <DndContext
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
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
                                    deleteFoodGroup={deleteFoodGroup}
                                    is_system={foodGroup.is_system}
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

                {/* Add Food Group Button */}
                <button
                    className="add-foodgroup-button"
                    onClick={() => addFoodGroup('Untitled')}
                >
                    ADD GROUP
                </button>
            </div>
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
