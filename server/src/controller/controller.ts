import type { Request, Response } from 'express';
import * as foodService from '../service/food.service.js';

const handleError = (error: unknown, res: Response) => {
    console.error('Controller error:', error);

    if (error instanceof Error) {
        // Optional: you can inspect error.name or extend to custom error types
        res.status(400).json({ message: error.message });
    } else {
        // Fallback for unknown error types
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getPantryByUser = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);

        if (Number.isNaN(userId)) {
            res.status(400).json({ message: 'Invalid user id' });
            return;
        }

        const pantryItems = await foodService.getPantryByUser(userId);
        res.status(200).json(pantryItems);
    } catch (error) {
        handleError(error, res);
    }
};

export const getFoodGroupsByUser = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);

        if (Number.isNaN(userId)) {
            res.status(400).json({ message: 'Invalid user id' });
            return;
        }

        const foodGroups = await foodService.getFoodGroupsByUser(userId);
        res.status(200).json(foodGroups);
    } catch (error) {
        handleError(error, res);
    }
};
