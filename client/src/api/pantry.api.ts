import { fetchJson } from './fetchJson';
import type { FoodUnitType, FoodEditType } from '../types/food';

const BASE_URL = process.env.API_URL;

export const getPantry = (userId: number) =>
    fetchJson<FoodUnitType[]>(`${BASE_URL}/pantry`, { credentials: 'include' });

export const addFoodItem = (userId: number, food: FoodUnitType) =>
    fetchJson<FoodUnitType>(`${BASE_URL}/pantry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(food),
        credentials: 'include',
    });

// Return type might be wrong!!!
export const changeFoodItem = (userId: number, food: FoodEditType) =>
    fetchJson<FoodUnitType>(`${BASE_URL}/pantry/${food.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(food),
        credentials: 'include',
    });

export const deleteFoodItem = (userId: number, foodId: number) =>
    fetchJson<any>(`${BASE_URL}/pantry/${foodId}/delete`, {
        method: 'PATCH',
        credentials: 'include',
    });
