import { Router } from 'express';
import { AuthService } from '../services/authService.js';


const router = Router();

router.post('/register', AuthService.register);
router.get('/:id', AuthService.getUser);

export { router };