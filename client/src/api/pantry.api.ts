import { fetchJson } from './fetchJson';
import type { FoodUnitType, FoodEditType } from '../types/food';

const BASE_URL = 'http://localhost:3001';

export const getPantry = (userId: number) =>
    fetchJson<FoodUnitType[]>(`${BASE_URL}/users/${userId}/pantry`);

export const addFoodItem = (userId: number, food: FoodUnitType) =>
    fetchJson<FoodUnitType>(`${BASE_URL}/users/${userId}/pantry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(food),
    });

// Return type might be wrong!!!
export const changeFoodItem = (userId: number, food: FoodEditType) =>
    fetchJson<FoodUnitType>(`${BASE_URL}/users/${userId}/pantry/${food.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(food),
    });

export const deleteFoodItem = (userId: number, foodId: number) =>
    fetchJson<any>(`${BASE_URL}/users/${userId}/pantry/${foodId}/delete`, {
        method: 'PATCH',
    });
