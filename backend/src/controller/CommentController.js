//Importa a classe CommentService que contém os métodos para tratamento dos dados
import CommentService from "../services/CommentService.js";
//Importa a classe AuthService que contém os métodos de autenticação
import AuthService from "../services/AuthService.js";
//Importa io que armazena a instância da classe `Server` que cria um servidor Socket.io
import { io } from "../../http.js";
//Importa jwt que permite a criação de tokens de acesso seguros para autenticação e autorização na aplicação
import jwt from 'jsonwebtoken';

/**
 * Classe controller para a rota de Comentários.
 */
export default class CommentCotroller{

    /**
     * Controlador para registrar um novo comentário
     * @param {*} req Request
     * @param {*} res Response
     */
    static async registerComment(req, res){
        try {
            //Chama o método `register` da classe CommentService para realizar o tratamento dos dados da requisição
            const post = await CommentService.register(req.body);
            //Dispara evento após a criação/inserção do comentário no banco de dados
            io.emit('commentcreate', post);
            //Retorna para o cliente uma mensagem de sucesso
            res.status(201).json({
                message : 'Comentário criado com sucesso!',
                id: post.id,
                title: post.title
            });
            
        } catch (err) {
            //Retorna para o cliente uma mensagem de erro caso a criação/inserção falhe
            res.status(400).json({ message : err.message})
        }
    }

    /**
     * Controlador para deletar um comentário
     * @param {*} req Request
     * @param {*} res Response
     */
    static async deleteComment(req, res){
        try {
            //Armazena o token do usuário passado através do cabeçalho da requisiçao
            //Ex.: authorization = "Bearer sda3wbGciOi..."
            const { authorization } = req.headers;
            //Retorna uma string do token do usuário sem a palavra `Bearer`
            const token = AuthService.getToken(authorization);
            if(!token){//Caso o token seja nulo, dispara um erro, acessando o acesso do usuário
                throw new Error('Acesso Negado!');
            }

            //Verifica a autenticidade do token e retorna os dados contidos nele.
            //Caso seja um token inválido, lança um erro.
            const decoded = jwt.verify(token, process.env.SECRET);

            //Obtem o valor da propriedade `isAdmin` através do payload do token
            const isAdmin = Number(decoded.isAdmin);
            //Chama o método `delete` da classe CommentService para realizar a deleção do comentário
            await CommentService.delete(req.params, decoded.id, isAdmin);
            //Dispara evento após a deleção do comentário
            io.emit('commentdeleted', req.params.id);
            //Retorna para o cliente uma mensagem de sucesso
            res.status(201).json({
                message : 'Post deletado com sucesso!',
                id: req.params.id
            });
        } catch (err) {
            //Retorna para o cliente uma mensagem de erro caso a deleção falhe
            res.status(400).json({ message : err.message});
        }
    }

    /**
     * Controlador para editar um comentário
     * @param {*} req Request
     * @param {*} res Response
     */
    static async editComment(req, res){
        //Armazena o token do usuário passado através do cabeçalho da requisiçao
        //Ex.: authorization = "Bearer sda3wbGciOi..."
        const { authorization } = req.headers;
        try{
            //Retorna uma string do token do usuário sem a palavra `Bearer`
            const token = AuthService.getToken(authorization);
            if(!token){//Caso o token seja nulo, dispara um erro, acessando o acesso do usuário
                throw new Error('Acesso Negado!');
            }

            //Verifica a autenticidade do token e retorna os dados contidos nele.
            //Caso seja um token inválido, lança um erro.
            const decoded = jwt.verify(token, process.env.SECRET);
            
            //Chama o método `edit` da classe CommentService para realizar a edição do comentário
            const updatedComment  = await CommentService.edit(req.body, req.params.id, decoded.id);
            //Dispara evento após a edição do comentário
            io.emit('commentedit', updatedComment);
            //Retorna para o cliente um obejto que contém o comentário atualizado
            res.status(200).json(updatedComment);
            
        }catch(err){
            //Retorna para o cliente uma mensagem de erro caso a edição falhe
            res.status(500).json({
                message: err.message
            });
        }
    }

    /**
     * Controlador para retornar todos os comentários de um determinado `Post`
     * @param {*} req Request
     * @param {*} res Response
     */
    static async getAllComment(req, res){
        try {
            //Chama o método `getAll` da classe CommentService para trazer todos os cometários de um determinado `Post`
            const posts = await CommentService.getAll(req.params);
            //Retorna para o cliente um array de objeto de comentários
            res.status(200).json(posts);
        } catch (err) {
            //Retorna para o cliente uma mensagem de erro caso o leitura dos dados falhe
            res.status(422).json({ message: err.message});
        }
    }
    
}