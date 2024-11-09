// Importa o módulo 'Router' da biblioteca 'express' para definir rotas de forma modular
import { Router } from 'express';
// Importa o controlador que contém as funções de manipulação de conteúdos educacionais
import EducationalContentsController from '../controller/EducationalContentsController.js';
// Importa o serviço de autenticação para verificação de tokens de autorização
import AuthService from '../services/AuthService.js';
// Cria uma nova instância do roteador para definir rotas relacionadas aos conteúdos educacionais
const router = Router();

// Rotas GET (rota para buscar todos os conteúdos educacionais)
// Aplica o middleware 'checkToken' para garantir que o usuário esteja autenticado antes de acessar a lista de conteúdos
router.get('/:offset', AuthService.checkToken, EducationalContentsController.getAllEducationalContent);

// Rotas POST (rota para registrar um novo conteúdo educacional)
// Aplica 'checkToken' para verificar a autenticação e chama a função de registro de conteúdo educacional
router.post('/register', AuthService.checkToken, EducationalContentsController.registerEducationalContent);

// Rota DELETE (rota para deletar um conteúdo educacional)
// Aplica 'checkToken' para verificar a autenticação e chama a função de exclusão de conteúdo com base no 'id' fornecido
router.delete('/delete/:id', AuthService.checkToken, EducationalContentsController.deleteEducationalContent);

// Rotas PATCH (rota para editar um conteúdo educacional)
// Aplica 'checkToken' para garantir que o usuário esteja autenticado e chama a função de edição de conteúdo com base no 'id'
router.patch('/edit/:id', AuthService.checkToken, EducationalContentsController.editEducationalContent);

// Exporta o roteador configurado para ser utilizado em outras partes da aplicação
export { router };
