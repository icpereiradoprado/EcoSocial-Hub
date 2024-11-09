import { Router } from 'express';
import UserController from '../controller/UserController.js';
import AuthService from '../services/AuthService.js';

//Armazena uma nova instância de roteador que permite definir rotas em módulos separados.
const router = Router();

//Rotas para Usuário
//GET (/users/)
//Rota para validar se o usuário está logado
router.get('/checkuser', UserController.checkUser);
//Rota para buscar um usuário pelo Id
router.get('/:id', UserController.getUserById);

//POST (/users/)
//Rota para registra um novo usuário
router.post('/register', UserController.registerUser);
//Rota para realizar o login do usuário
router.post('/login', UserController.loginUser);

//DELETE (/users/)
//Rota para deletar um usuário
router.delete('/delete/:name/:email', UserController.deleteUser);

//PATCH (/users/)
//Rota para atualizar as informações de um usuário
router.patch('/edit/:id', AuthService.checkToken, UserController.editUser);

//Exporta as Rotas de usário
export { router };