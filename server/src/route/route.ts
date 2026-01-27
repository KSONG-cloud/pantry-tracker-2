import { Router } from 'express';
import {
    getFoodMap,
    getPantryByUser,
    addFoodItemPantry,
    patchFoodItemPantry,
    deletePantryByUser,
    getFoodGroupsByUser,
} from '../controller/controller.js';

const router = Router();

// Delete later
import type { Request, Response } from 'express';
import { addFood as addFoodRepo } from '../database/food.repository.js';
const addFood = async (req: Request, res: Response) => {
    const food = req.body.food_name;
    const output = await addFoodRepo(food);
    res.status(200).json(output);
};
router.post('/foodadd', addFood);

// Food Routes
router.get('/foodmap', getFoodMap);

// Pantry Routes
// GET
router.get('/users/:userId/pantry', getPantryByUser);
// POST
router.post('/users/:userId/pantry', addFoodItemPantry);
// PATCH
router.patch('/users/:userId/pantry/:pantryId', patchFoodItemPantry);
// DELETE
router.patch('/users/:userId/pantry/:pantryId/delete', deletePantryByUser);

// Food Groups Routes
router.get('/users/:userId/foodgroups', getFoodGroupsByUser);


export { router };
