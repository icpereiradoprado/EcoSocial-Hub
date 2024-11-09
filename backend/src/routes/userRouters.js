// Importa o módulo 'Router' da biblioteca 'express' para definir rotas de forma modular
import { Router } from 'express';
// Importa o controlador de usuários que contém as funções para manipulação de dados de usuário
import UserController from '../controller/UserController.js';
// Importa o serviço de autenticação para verificação de tokens de autorização
import AuthService from '../services/AuthService.js';
// Cria uma nova instância do roteador para definir rotas relacionadas a usuários
const router = Router();
// Rotas GET
// Rota para verificar se o usuário está autenticado (ou outras verificações de usuário)
// Não requer autenticação, portanto não usa o middleware 'checkToken'
router.get('/checkuser', UserController.checkUser);

// Rota para buscar um usuário específico pelo 'id'
// Também não requer autenticação adicional neste exemplo
router.get('/:id', UserController.getUserById);

// Rotas POST
// Rota para registrar um novo usuário
// Permite a criação de um novo usuário sem autenticação prévia
router.post('/register', UserController.registerUser);

// Rota para realizar o login do usuário
// Permite o login sem autenticação prévia (o usuário obtém um token após o login bem-sucedido)
router.post('/login', UserController.loginUser);

// Rotas DELETE
// Rota para deletar um usuário específico, identificado pelo 'name' e 'email'
// Não exige autenticação adicional neste exemplo, mas normalmente seria recomendado usar um middleware de verificação
router.delete('/delete/:name/:email', UserController.deleteUser);

// Rotas PATCH
// Rota para editar as informações de um usuário específico, identificado pelo 'id'
// Usa o middleware 'checkToken' para garantir que o usuário esteja autenticado antes de permitir a edição
router.patch('/edit/:id', AuthService.checkToken, UserController.editUser);

// Exporta o roteador configurado para ser utilizado em outras partes da aplicação
export { router };
