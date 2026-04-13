import { fetchJson } from './fetchJson';

// Types
import type { FoodGroupType } from '../types/food';

const BASE_URL = import.meta.env.VITE_API_URL;

export const getFoodGroups = () =>
    fetchJson<FoodGroupType[]>(`${BASE_URL}/foodgroups`, {
        credentials: 'include',
    });

export const addFoodGroup = (group: FoodGroupType) =>
    fetchJson<FoodGroupType>(`${BASE_URL}/foodgroups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(group),
        credentials: 'include',
    });

export const changeFoodGroup = (changes: Partial<FoodGroupType>) =>
    fetchJson<FoodGroupType[]>(`${BASE_URL}/foodgroups/${changes.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes),
        credentials: 'include',
    });

export const reorderFoodGroup = (
    reoder: { id: number; display_order: number }[]
) =>
    fetchJson<FoodGroupType[]>(`${BASE_URL}/foodgroups/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reoder),
        credentials: 'include',
    });

export const deleteFoodGroup = (groupId: number) =>
    fetchJson<FoodGroupType[]>(`${BASE_URL}/foodgroups/${groupId}/delete`, {
        method: 'DELETE',
        credentials: 'include',
    });
