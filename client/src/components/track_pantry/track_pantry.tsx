// Components
import { AddItemModal } from './add_item_modal';
import { FoodGroup } from './group_of_food';
import { FoodItemModal } from './food_item_modal';

// React stuff
import { useEffect, useMemo, useRef, useState } from 'react';

// Types
import type { FoodUnitType, FoodGroupType } from '../../types/food';

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
        const res = await fetch('http://localhost:3001/food/1');
        const resJSON = await res.json();
        setFoodItems(resJSON);
        setLoading(false);
    };

    const fetchFoodGroups = async () => {
        // Fetch food groups from backend
        const res = await fetch('http://localhost:3001/food-groups');
        const resJSON = await res.json();
        const food_groups: FoodGroupType = resJSON[0]['foodgroups'];
        setFoodGroups(food_groups);
    };

    // add Food Item and Group Handlers
    const addFoodItem = async (foodItem: FoodUnitType) => {
        // Logic to add food item to pantry
        // Optimistically update UI
        setFoodItems((prev) => [...prev, foodItem]);

        // Send GET request to backend to see if food name exists

        // If not, send POST request to backend to add food name

        // Then send GET request to backend to get food ID

        // Change to correct food ID in foodItem

        // Send POST request to backend to add food item
    };
    const addFoodGroup = async (groupName: string) => {
        // Logic to add food group

        // How many groups in foodGroups
        const newGroupId = Object.keys(foodGroups).length + 1;
        setFoodGroups((prev) => ({ ...prev, [newGroupId]: groupName }));

        // Send POST request to backend to add food group to account
    };

    // Change Food Item and Group Handlers
    const changeFoodItem = async (editedFood: FoodUnitType) => {
        // Logic to change food item in pantry
        setFoodItems((prev) =>
            prev.map((item) =>
                item.id === editedFood.id ? { ...item, ...editedFood } : item
            )
        );

        // Send PUT request to backend to update food item
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
        // Logic to save edited food item
        console.log('Saving edited food item:', editedFood);

        // Optimistically update UI
        changeFoodItem(editedFood);

        // Send PUT request to backend to update food item
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
        console.log('Fetched food groups and items from backend.');
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
