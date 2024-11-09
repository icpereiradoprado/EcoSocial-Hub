//Importa a classe PostService que contém os métodos para tratamento dos dados
import PostService from '../services/PostService.js';
//Importa a classe AuthService que contém os métodos de autenticação
import AuthService from '../services/AuthService.js';
//Importa io que armazena a instância da classe `Server` que cria um servidor Socket.io
import { io } from '../../http.js';
//Importa jwt que permite a criação de tokens de acesso seguros para autenticação e autorização na aplicação
import jwt from 'jsonwebtoken';


/**
 * Classe controller para a rota de Posts.
 */
export default class PostController{

    /**
     * Controlador para registrar um novo Post
     * @param {*} req Request
     * @param {*} res Response
     */
    static async registerPost(req, res){
        try {
            //Chama o método `register` da classe PostService para realizar o tratamento dos dados da requisição           
            const post = await PostService.register(req.body);
            //Dispara evento após a criação/inserção do Post no banco de dados
            io.emit('postcreate', post);
            //Retorna para o cliente uma mensagem de sucesso     
            res.status(201).json({
                message : 'Post criado com sucesso!',
                id: post.id,
                title: post.title
            });
            
        } catch (err) {
            //Retorna para o cliente uma mensagem de erro caso a criação/inserção falhe          
            res.status(400).json({ message : err.message})
        }
    }

    /**
     * Controlador para deletar um Post
     * @param {*} req Request
     * @param {*} res Response
     */
    static async deletePost(req, res){
        
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
            //Chama o método `delete` da classe PostService para realizar a deleção do Post            
            await PostService.delete(req.params, decoded.id, isAdmin);
            //Dispara evento após a deleção do Post
            io.emit('postdeleted', req.params.id);
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
     * Controlador para editar um Post
     * @param {*} req Request
     * @param {*} res Response
     */
    static async editPost(req, res){
        //Armazena o token do usuário passado através do cabeçalho da requisiçao
        //Ex.: authorization = "Bearer sda3wbGciOi..."       
        const { authorization } = req.headers;
        try{
            //Retorna uma string do token do usuário sem a palavra `Bearer`
            const token = AuthService.getToken(authorization);
            if(!token){
                throw new Error('Acesso Negado!');
            }

            //Verifica a autenticidade do token e retorna os dados contidos nele.
            //Caso seja um token inválido, lança um erro.
            const decoded = jwt.verify(token, process.env.SECRET);
            
            //Chama o método `edit` da classe PostService para realizar a edição do Post
            const updatedPost  = await PostService.edit(req.body, req.params.id, decoded.id);
            //Dispara evento após a edição do Post
            io.emit('postedit', updatedPost);
            //Retorna para o cliente um obejto que contém o Post atualizado
            res.status(200).json(updatedPost);
            
        }catch(err){
            //Retorna para o cliente uma mensagem de erro caso a edição falhe 
            res.status(500).json({
                message: err.message
            });
        }
    }

    /**
     * Controlador para retornar todos os Posts
     * @param {*} req Request
     * @param {*} res Response
     */
    static async getAllPost(req, res){
        try {
            //Chama o método `getAll` da classe PostService para trazer todos os Posts do banco de dados`           
            const posts = await PostService.getAll(req.params);
            //Retorna para o cliente um array de objeto de Posts           
            res.status(200).json(posts);
        } catch (err) {
            //Retorna para o cliente uma mensagem de erro caso o leitura dos dados falhe
            res.status(422).json({ message: err.message});
        }
    }

     /**
     * Controlador para registrar os likes no post
     * @param {*} req Request
     * @param {*} res Response
     */
    static async upVote(req, res){
        try {
            //Chama o método "Up" da classe PostService para registrar um like no post`           
            await PostService.up(req.body);
            //Retorna para o cliente uma mensagem de sucesso
            res.status(200).json({message: 'Ação realizada com sucesso!'});
        } catch (err) {
            //Retorna para o cliente uma mensagem de erro caso a ação de "like" falhe            
            res.status(422).json({ message: err.message})
        }
    }

    /**
     * Controlador para registrar os deslikes no post
     * @param {*} req Request
     * @param {*} res Response
     */
    static async downVote(req, res){
        try {
            //Chama o método "down" da classe PostService para registrar um deslike no post`           
            await PostService.down(req.body);
            //Retorna para o cliente uma mensagem de sucesso
            res.status(200).json({message: 'Ação realizada com sucesso!'});
        } catch (err) {
            //Retorna para o cliente uma mensagem de erro caso a ação de "deslike" falhe                        
            res.status(422).json({ message: err.message})
        }
    }

    /**
     * Controlador para trazer todos os posts votados por um determinado usuário
     * @param {*} req Request
     * @param {*} res Response
     */
    static async postsVoted(req, res){
        try {
            //Chama o método `postsVoted` da classe `PostService` para obter os posts votados pelo usuário
            const postsVoted = await PostService.postsVoted(req.params.userId, req.params.postId);
            //Retorna para o cliente uma mensagem de sucesso e os posts votados
            res.status(200).json({message: 'Requisição realizada com sucesso!', postsVoted: postsVoted});
        } catch (err) {
            //Retorna para o cliente uma mensagem de erro
            res.status(422).json({ message: err.message})
        }
    }
}