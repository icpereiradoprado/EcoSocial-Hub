// Importa o módulo 'Router' da biblioteca 'express' para criar rotas modulares
import { Router } from "express";
// Importa o controlador de postagens que contém as funções para manipulação de postagens
import PostController from "../controller/PostController.js";
// Importa o serviço de autenticação para verificação de tokens de autorização
import AuthService from "../services/AuthService.js";
// Cria uma nova instância do roteador para definir as rotas relacionadas a postagens

const router = Router();
// Rotas GET
// Rota para buscar todas as postagens com base em um 'offset' para paginação
// Aplica o middleware 'checkToken' para garantir que o usuário esteja autenticado
router.get('/:offset', AuthService.checkToken, PostController.getAllPost);
// Rota para buscar as postagens que receberam votos de um usuário específico, identificados por 'userId' e 'postId'
// Aplica 'checkToken' para verificar a autenticação antes de buscar os dados
router.get('/postsvoted/:userId/:postId', AuthService.checkToken, PostController.postsVoted);

// Rotas POST
// Rota para registrar uma nova postagem
// Aplica 'checkToken' para verificar a autenticação antes de permitir a criação da postagem
router.post('/register', AuthService.checkToken, PostController.registerPost);

// Rota para registrar um voto positivo em uma postagem
// Aplica 'checkToken' para garantir a autenticação antes de registrar o voto
router.post('/up', AuthService.checkToken, PostController.upVote);

// Rota para registrar um voto negativo em uma postagem
// Aplica 'checkToken' para verificar a autenticação antes de registrar o voto
router.post('/down', AuthService.checkToken, PostController.downVote);

// Rotas DELETE
// Rota para deletar uma postagem específica, identificada pelo 'id'
// Aplica 'checkToken' para garantir que o usuário esteja autenticado antes de deletar a postagem
router.delete('/delete/:id', AuthService.checkToken, PostController.deletePost);

// Rotas PATCH
// Rota para editar uma postagem específica, identificada pelo 'id'
// Aplica 'checkToken' para verificar a autenticação antes de permitir a edição da postagem
router.patch('/edit/:id', AuthService.checkToken, PostController.editPost);

// Exporta o roteador configurado para ser utilizado em outras partes da aplicação
export { router };
