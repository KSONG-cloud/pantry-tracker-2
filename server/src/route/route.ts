import { Router } from 'express';
import {
    getFoodMap,
    getPantryByUser,
    addFoodItemPantry,
    getFoodGroupsByUser,
} from '../controller/controller.js';

const router = Router();

// Food Routes
router.get('/foodmap', getFoodMap);

// Pantry Routes
// POST
router.post('/users/:userId/pantry', addFoodItemPantry);
router.get('/users/:id/food-groups', getFoodGroupsByUser);

export { router };
