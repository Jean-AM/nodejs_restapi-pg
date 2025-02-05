import { Router } from "express";
import { pool } from '../db.js'
import { createUser, deleteUser, getUserById, getUsers, updateUser, getInactiveUsers } from '../controllers/users.controllers.js'

const router = Router();

router.get('/users', getUsers);

router.get('/users/inactive', getInactiveUsers);

router.get('/users/:id', getUserById);

router.post('/users', createUser);

router.delete('/users/:id', deleteUser);

router.put('/users/:id', updateUser);

export default router;