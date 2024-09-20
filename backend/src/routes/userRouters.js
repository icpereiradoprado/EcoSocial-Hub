import { Router } from 'express';
import UserController from '../controller/UserController.js';

const router = Router();

//Rotas para Usuário
//GET
router.get('/checkuser', UserController.checkUser);
router.get('/:id', UserController.getUserById);
//POST
router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
//DELETE
router.delete('/delete/:name/:email', UserController.deleteUser);

export { router };