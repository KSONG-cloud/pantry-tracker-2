import { fetchJson } from './fetchJson';

const BASE_URL = 'http://localhost:3001';

export const accountApi = {
    getAccount: () => fetchJson(`${BASE_URL}/account`),
    updateAccount: (data: any) =>
        fetchJson(`${BASE_URL}/account`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
    deleteAccount: () => fetchJson(`${BASE_URL}/account`, { method: 'DELETE' }),
};

export const authApi = {
    getAuthentication: () =>
        fetch(`${BASE_URL}/auth/me`, {
            method: 'GET',
            credentials: 'include',
        }),

    register: (username: string, email: string, password: string) =>
        fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
            }),
            credentials: 'include',
        }),

    login: (email: string, password: string) =>
        fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password }),
            credentials: 'include',
        }),

    logout: () =>
        fetch(`${BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        }),
};
