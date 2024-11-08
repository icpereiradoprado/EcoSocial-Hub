//Importa a classe EducationalContentService que contém os métodos para tratamento dos dados
import EducationalContentService from '../services/EducationalContentService.js'
//Importa a classe AuthService que contém os métodos de autenticação
import AuthService from '../services/AuthService.js'
//Importa io que armazena a instância da classe `Server` que cria um servidor Socket.io
import { io } from '../../http.js';
//Importa jwt que permite a criação de tokens de acesso seguros para autenticação e autorização na aplicação
import jwt from 'jsonwebtoken'

/**
 * Classe controller para a rota de Conteudos educacionais.
 */
export default class EducationalContentsController{

    /**
     * Controlador para registrar um novo Conteudo Educacional
     * @param {*} req Request
     * @param {*} res Response
     */
    static async registerEducationalContent(req, res){
        try {
            //Armazena o token do usuário passado através do cabeçalho da requisiçao
            const { authorization } = req.headers;
            //Retorna uma string do token do usuário sem a palavra `Bearer`
            const token = AuthService.getToken(authorization);

            if(!token){//Caso o token seja nulo, dispara um erro, acessando o acesso do usuário
                throw new Error('Acesso Negado!');
            }
            //Caso seja um token inválido, lança um erro.
            const decoded = jwt.verify(token, process.env.SECRET);

            //Obtem o valor da propriedade `isAdmin` através do payload do token e valida se o usuário é um ADM
            if(Number(decoded.isAdmin) && Number(decoded.isAdmin) === 1){
            //Armazena o conteudo educacional na const "content" e registra no banco de dados          
                const content = await EducationalContentService.register(req.body);
            //Dispara evento após a criação do conteúdo
                io.emit('educationalcontentcreate', content);
            //Retorna para o cliente uma mensagem de sucesso            
                res.status(201).json({
                    message : 'Conteúdo criado com sucesso!',
                    id: content.id,
                    title: content.title
                });
            }else{
            //Retorna para o cliente uma mensagem de erro caso o ele não seja um usuario ADM            
                throw Error('Acesso Negado! Você precisa ser um administrador para executar esta ação!');
            }
        } catch (err) {
            //Retorna para o cliente uma mensagem de erro caso o registro falhe            
            res.status(400).json({ message : err.message})
        }
    }

     /**
     * Controlador para deletar um Conteudo
     * @param {*} req Request
     * @param {*} res Response
     */
    static async deleteEducationalContent(req, res){
            //Armazena o token do usuário passado através do cabeçalho da requisiçao
            //Ex.: authorization = "Bearer sda3wbGciOi..."
        try {
            const { authorization } = req.headers;
            //Retorna uma string do token do usuário sem a palavra `Bearer`         
            const token = AuthService.getToken(authorization);
            if(!token){//Caso o token seja nulo, dispara um erro, acessando o acesso do usuário
                throw new Error('Acesso Negado!');
            }
            //Verifica a autenticidade do token e retorna os dados contidos nele.
            //Caso seja um token inválido, lança um erro.
            const decoded = jwt.verify(token, process.env.SECRET);

            //Obtem o valor da propriedade `isAdmin` através do payload do token e valida se o usuário é um ADM
            if(Number(decoded.isAdmin) && Number(decoded.isAdmin) === 1){
            //É chamada a função que delete que faz a exclusão dos dados no banco de dados
                await EducationalContentService.delete(req.params);
            //Dispara evento após a criação do conteúdo              
                io.emit('educationalcontentdeleted', req.params.id);
            //Retorna para o cliente uma mensagem de sucesso
                res.status(201).json({
                    message : 'Conteúdo deletado com sucesso!',
                    id: req.params.id
                });
            }else{
            //Retorna para o cliente uma mensagem de erro caso o ele não seja um usuario ADM            
                throw Error('Acesso Negado! Você precisa ser um administrador para executar esta ação!');
            }
        } catch (err) {
            //Retorna para o cliente uma mensagem de erro caso a deleção falhe          
            res.status(400).json({ message : err.message});
        }
    }

    /**
     * Controlador para retornar todos os conteudos educacionais
     * @param {*} req Request
     * @param {*} res Response
     */
    static async getAllEducationalContent(req, res){
        try {
            //Chama o método `getAll` da classe EducationalContentService para trazer todos os conteúdos do banco de dados`           
            const contents = await EducationalContentService.getAll(req.params);
            //Retorna para o cliente um array de objeto de conteúdos           
            res.status(200).json(contents);
        } catch (err) {
            //Retorna para o cliente uma mensagem de erro caso o leitura dos dados falhe
            res.status(422).json({ message: err.message});
        }
    }

    /**
     * Controlador para editar um Conteudo
     * @param {*} req Request
     * @param {*} res Response
     */    
    static async editEducationalContent(req, res){
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

            //Obtem o valor da propriedade `isAdmin` através do payload do token e valida se o usuário é um ADM
            if(Number(decoded.isAdmin) && Number(decoded.isAdmin) === 1){
                const user = await AuthService.getUserByToken(authorization);
            //Chama o método `edit` da classe EducationalContentService  para realizar a edição do Conteudo 
                const updatedContent  = await EducationalContentService.edit(req.body, req.params.id, user.id);
            //Dispara evento após a edição do conteudo       
                io.emit('educationalcontentedit', updatedContent);
            //Retorna para o cliente um obejto que contém o conteudo atualizado                
                res.status(200).json(updatedContent);
            }else{
            //Retorna para o cliente uma mensagem de erro caso o ele não seja um usuario ADM            
                throw Error('Acesso Negado! Você precisa ser um administrador para executar esta ação!');
            }
            
        }catch(err){
            //Retorna para o cliente uma mensagem de erro caso a edição falhe           
            res.status(500).json({
                message: err.message
            });
        }
    }
}