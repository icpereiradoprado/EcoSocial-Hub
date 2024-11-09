// Importa o módulo 'Router' da biblioteca 'express' para criar rotas de forma modular
import { Router } from "express";
// Importa o serviço de autenticação para verificar tokens de autorização
import AuthService from "../services/AuthService.js";
// Importa o controlador de comentários que contém as funções de manipulação de comentários
import CommentCotroller from "../controller/CommentController.js";
// Cria uma nova instância de roteador para definir rotas específicas para comentários
const router = Router();

// POST (rota para registro de um novo comentário)
// Usa o middleware 'checkToken' de 'AuthService' para verificar se o usuário está autenticado antes de registrar um comentário
router.post('/register', AuthService.checkToken, CommentCotroller.registerComment);

// PATCH (rota para edição de um comentário)
// Verifica a autenticação do usuário com 'checkToken' e chama a função de edição de comentários pelo 'id' do comentário
router.patch('/edit/:id', AuthService.checkToken, CommentCotroller.editComment);

// DELETE (rota para deletar um comentário)
// Verifica a autenticação com 'checkToken' e chama a função de exclusão de comentário pelo 'id' fornecido
router.delete('/delete/:id', AuthService.checkToken, CommentCotroller.deleteComment);

// GET (rota para buscar todos os comentários relacionados a uma postagem específica)
// Requer autenticação e chama a função de busca de comentários baseando-se no 'postId', 'offset' (paginação), e 'commentParent' (se aplicável)
router.get('/:postId/:offset/:commentParent', AuthService.checkToken, CommentCotroller.getAllComment);

// Exporta o roteador configurado para ser usado em outras partes da aplicação
export { router };