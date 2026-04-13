import { fetchJson } from './fetchJson';
import type { FoodUnitType, FoodEditType } from '../types/food';

const BASE_URL = import.meta.env.VITE_API_URL;

export const getPantry = () =>
    fetchJson<FoodUnitType[]>(`${BASE_URL}/pantry`, { credentials: 'include' });

export const addFoodItem = (food: FoodUnitType) =>
    fetchJson<FoodUnitType>(`${BASE_URL}/pantry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(food),
        credentials: 'include',
    });

// Return type might be wrong!!!
export const changeFoodItem = (food: FoodEditType) =>
    fetchJson<FoodUnitType>(`${BASE_URL}/pantry/${food.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(food),
        credentials: 'include',
    });

export const deleteFoodItem = (foodId: number) =>
    fetchJson<any>(`${BASE_URL}/pantry/${foodId}/delete`, {
        method: 'PATCH',
        credentials: 'include',
    });
