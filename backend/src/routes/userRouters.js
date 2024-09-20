import { Router } from 'express';
import UserController from '../controller/UserController.js';

const router = Router();

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.delete('/delete/:name/:email', UserController.deleteUser);

export { router };