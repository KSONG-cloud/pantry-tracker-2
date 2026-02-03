import { fetchJson } from './fetchJson';

// Types
import type { FoodGroupType } from '../types/food';

const BASE_URL = 'http://localhost:3001';

export const getFoodGroups = (userId: number) =>
    fetchJson<FoodGroupType[]>(`${BASE_URL}/users/${userId}/foodgroups`);

export const addFoodGroup = (userId: number, group: FoodGroupType) =>
    fetchJson<FoodGroupType>(`${BASE_URL}/users/${userId}/foodgroups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(group),
    });

export const deleteFoodGroup = (userId: number, groupId: number) =>
    fetchJson<FoodGroupType[]>(
        `${BASE_URL}/users/${userId}/foodgroups/${groupId}/delete`,
        {
            method: 'DELETE',
        }
    );
