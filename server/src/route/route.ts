import { Router } from 'express';
import {
    getFoodMap,
    getPantryByUser,
    addFoodItemPantry,
    patchFoodItemPantry,
    deletePantryByUser,
    getFoodGroupsByUser,
    addFoodGroupsByUser,
    patchFoodGroupsByUser,
    reorderFoodGroupsByUser,
    deleteFoodGroupsByUser,
} from '../controller/controller.js';

// Middleware
import { authenticateToken } from '../auth/auth.middleware.js';

const router = Router();

// Food Routes
router.get('/foodmap', authenticateToken, getFoodMap);

// Pantry Routes
// GET
router.get('/pantry', authenticateToken, getPantryByUser);
// POST
router.post('/pantry', authenticateToken, addFoodItemPantry);
// PATCH
router.patch('/pantry/:pantryId', authenticateToken, patchFoodItemPantry);
// DELETE
router.patch('/pantry/:pantryId/delete', authenticateToken, deletePantryByUser);

// Food Groups Routes
// GET
router.get('/foodgroups', authenticateToken, getFoodGroupsByUser);
// POST
router.post('/foodgroups', authenticateToken, addFoodGroupsByUser);
// PATCH
router.patch('/foodgroups/reorder', authenticateToken, reorderFoodGroupsByUser);
router.patch(
    '/foodgroups/:foodgroupId',
    authenticateToken,
    patchFoodGroupsByUser
);
// DELETE
router.delete(
    '/foodgroups/:foodgroupId/delete',
    authenticateToken,
    deleteFoodGroupsByUser
);

export { router };
