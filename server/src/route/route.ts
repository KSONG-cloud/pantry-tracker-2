import { Router } from 'express';
import {
    getFoodMap,
    getPantryByUser,
    getFoodGroupsByUser,
} from '../controller/controller.js';

const router = Router();

// Food Routes
router.get('/foodmap', getFoodMap);

router.get('/users/:id/food-groups', getFoodGroupsByUser);

export { router };
