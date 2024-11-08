//Importa a classe RecyclingCenterService que contém os métodos para tratamento dos dados
import RecyclingCenterService from "../services/RecyclingCenterService.js";
//Importa a classe AuthService que contém os métodos de autenticação
import AuthService from "../services/AuthService.js";
//Importa io que armazena a instância da classe `Server` que cria um servidor Socket.io
import { io } from '../../http.js';
//Importa jwt que permite a criação de tokens de acesso seguros para autenticação e autorização na aplicação
import jwt from 'jsonwebtoken';


/**
 * Classe controller para a rota de Centros de reciclagem.
 */
export default class RecyclingCenterController{

   /**
     * Controlador para registrar um novo Centro de Reciclagem
     * @param {*} req Request
     * @param {*} res Response
     */    
    static async registerRecyclingCenter(req, res){
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
            //Armazena o centro na const "recyclingCenter" e registra no banco de dados                          
                const recyclingCenter = await RecyclingCenterService.register(req.body);
            //Dispara evento após a criação do conteúdo        
                io.emit('recyclingcentercreate', recyclingCenter);
            //Retorna para o cliente uma mensagem de sucesso             
                res.status(201).json({
                    message : 'Cadastro realizado com sucesso!',
                    id: recyclingCenter.id,
                    title: recyclingCenter.title
                });
            }else{
            //Retorna para o cliente uma mensagem de erro caso o ele não seja um usuario ADM                          
                throw Error('Acesso Negado! Você precisa ser um administrador para executar esta ação!');
            }
        }catch(err){
            //Retorna para o cliente uma mensagem de erro caso o registro falhe            
            res.status(400).json({ message : err.message})
        }
    }

     /**
     * Controlador para deletar um Centro de Reciclagem
     * @param {*} req Request
     * @param {*} res Response
     */
    static async deleteRecyclingCenter(req, res){
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
                await RecyclingCenterService.delete(req.params);
            //Dispara evento após a criação do conteúdo              
                io.emit('recyclingcenterdeleted', req.params.id);
            //Retorna para o cliente uma mensagem de sucesso
                res.status(201).json({
                    message : 'Ponto de coleta e descarte deletado com sucesso!',
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
     * Controlador para retornar todos os centros de reciclagem
     * @param {*} req Request
     * @param {*} res Response
     */
    static async getAllRecyclingCenter(req, res){
        try {
            //Chama o método `getAll` da classe RecyclingCenterService para trazer todos os centros do banco de dados`                
            const recyclingCenters = await RecyclingCenterService.getAll(req.params);
            //Retorna para o cliente um array de objeto de conteúdos                   
            res.status(200).json(recyclingCenters);
        } catch (err) {
            //Retorna para o cliente uma mensagem de erro caso o leitura dos dados falhe 
            res.status(422).json({ message: err.message});
        }
    }

    /**
     * Controlador para Centro de reciclagem um Conteudo
     * @param {*} req Request
     * @param {*} res Response
     */   
    static async editRecyclingCenter(req, res){
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
            //Obtem o valor da propriedade `isAdmin` através do payload do token e valida se o usuário é um ADM
            if(Number(decoded.isAdmin) && Number(decoded.isAdmin) === 1){
            //Chama o método `edit` da classe RecyclingCenterService  para realizar a edição dos dados do Centro 
                const updatedRecyclingCenter  = await RecyclingCenterService.edit(req.body, req.params.id);
            //Dispara evento após a edição do conteudo       
                io.emit('recyclingcenteredit', updatedRecyclingCenter);
            //Retorna para o cliente um obejto que contém o conteudo atualizado                
                res.status(200).json(updatedRecyclingCenter);
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