import { Router } from 'express';
import {
    getPantryByUser,
    getFoodGroupsByUser,
} from '../controller/controller.js';

const router = Router();

router.get('/users/:id/pantry', getPantryByUser);

router.get('/users/:id/food-groups', getFoodGroupsByUser);

export { router };
