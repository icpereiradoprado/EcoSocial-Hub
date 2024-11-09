// Importa o módulo 'Router' da biblioteca 'express' para criar rotas modulares
import { Router } from 'express';
// Importa o controlador de centros de reciclagem que contém as funções de manipulação de dados
import RecyclingCenterController from '../controller/RecyclingCenterController.js';
// Importa o serviço de autenticação para verificação de tokens de autorização
import AuthService from '../services/AuthService.js';

// Cria uma nova instância do roteador para definir as rotas relacionadas aos centros de reciclagem
const router = Router();

// Rotas GET
// Rota para buscar todos os centros de reciclagem associados a um usuário específico, identificado por 'userId'
// Aplica o middleware 'checkToken' para garantir que o usuário esteja autenticado antes de acessar a rota
router.get('/:userId', AuthService.checkToken, RecyclingCenterController.getAllRecyclingCenter);

// Rotas POST
// Rota para registrar um novo centro de reciclagem
// Aplica 'checkToken' para verificar a autenticação do usuário antes de permitir o registro
router.post('/register', AuthService.checkToken, RecyclingCenterController.registerRecyclingCenter);

// Rota DELETE
// Rota para deletar um centro de reciclagem específico, identificado pelo 'id'
// Aplica 'checkToken' para garantir que o usuário esteja autenticado antes de realizar a exclusão
router.delete('/delete/:id', AuthService.checkToken, RecyclingCenterController.deleteRecyclingCenter);

// Rotas PATCH
// Rota para editar as informações de um centro de reciclagem específico, identificado pelo 'id'
// Aplica 'checkToken' para verificar a autenticação do usuário antes de permitir a edição
router.patch('/edit/:id', AuthService.checkToken, RecyclingCenterController.editRecyclingCenter);

// Exporta o roteador configurado para ser utilizado em outras partes da aplicação
export { router };
