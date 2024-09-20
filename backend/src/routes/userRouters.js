import { Router } from 'express';
import UserController from '../controller/UserController.js';

const router = Router();

router.post('/register', UserController.registerUser);
router.delete('/delete/:name/:email', UserController.deleteUser);
//router.get('/:id', AuthService.getUser);

export { router };