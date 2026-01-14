import type { Request, Response } from 'express';
import * as foodService from '../service/food.service.js';

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
        console.error('Controller error:', error);
        if (error instanceof Error) {
            res.status(404).json({ message: error });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
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
        console.error('Controller error:', error);
        if (error instanceof Error) {
            res.status(404).json({ message: error });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
