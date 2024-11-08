//Importa a classe UserService que contém os métodos para tratamento dos dados
import UserService from "../services/UserService.js";
//Importa a classe AuthService que contém os métodos de autenticação
import AuthService from "../services/AuthService.js";
//Importa jwt que permite a criação de tokens de acesso seguros para autenticação e autorização na aplicação
import jwt from "jsonwebtoken";

export default class UserController {

    /**
     * Controlador para registrar um novo usuário 
     * @param {*} req Request
     * @param {*} res Response
     */
    static async registerUser(req, res){
        try{
            //Armazena o usuario cadastrado na const "user" e registra no banco de dados          
            const user = await UserService.register(req.body);
            //Autentica o novo usuário
            const token = await AuthService.createUserToken(user);
            //retorna o token no response
            res.status(200).json({
                message: "Você está autenticado!",
                token : token,
                userId: user.id
            });

        }catch(err){
            //Retorna para o cliente uma mensagem de erro caso o registro falhe                       
            res.status(400).json({ message : err.message });
        }
    }

    /**
     * Controlador para deletar um usuário
     * @param {*} req Request
     * @param {*} res Response
     */
    static async deleteUser(req, res){
        try{
            //Chama o método `delete` da classe UserService para deletar o usuario no banco de dados
            const message = await UserService.delete(req.params);
            //Retorna para o cliente uma mensagem de sucesso           
            res.status(200).json({ message });
        }catch(err){
            //Retorna para o cliente uma mensagem de erro caso a deleção falhe
            res.status(400).json({ message : err.message});
        }
    }

    /**
     * Controlador para realizar o login de um usuário
     * @param {*} req Request
     * @param {*} res Response
     */
    static async loginUser(req, res){
        try{
            //Realiza o login do usuário e retorna o Usuário e o token de autenticação
            const {user, token} = await AuthService.login(req.body);

            //retorna o token no response
            res.status(200).json({
                message: "Você está autenticado!",
                token : token,
                userId: user.id,
                isAdmin: user.is_admin
            });

        }catch(err){
            //Retorna para o cliente uma mensagem de erro caso o login falhe
            res.status(422).json({ message : err.message})
        }
    }

    /**
     * Controlador para validar o usuário logado
     * @param {*} req Request
     * @param {*} res Resposta
     */
    static async checkUser(req, res){
        let currentUser = null;
        
        //Armazena o token do usuário passado através do cabeçalho da requisiçao
        //Ex.: authorization = "Bearer sda3wbGciOi..."
        const { authorization } = req.headers;

        if(authorization){
            //Retorna uma string do token do usuário sem a palavra `Bearer`
            const token = AuthService.getToken(authorization);
            //Verifica a autenticidade do token e retorna os dados contidos nele.
            //Caso seja um token inválido, lança um erro.            
            const decoded = jwt.verify(token, process.env.SECRET);
            //Chama o método `getUserById` da classe UserService que retorna um usuário cadastrado pelo ID
            currentUser = await UserService.getUserById(decoded.id);
        }
        //Retorna para o cliente o usuário filtrado pelo ID
        res.status(200).send(currentUser);
    }

    /**
     * Controlador para retornar um usuário
     * @param {*} req Request
     * @param {*} res Response
     */
    static async getUserById(req, res){
        const { id } = req.params;
        try{
            //Chama o método `getUserById` da classe UserService que retorna um usuário cadastrado pelo ID
            const user = await UserService.getUserById(id);
            //Retorna para o cliente o usuário filtrado pelo ID
            res.status(200).json(user);
        }catch(err){
            //Retorna para o cliente uma mensagem de erro caso a leitura dos dados falhe
            res.status(422).json({ message : err.message});
        }
    }

    /**
     * Controlador para editar as informações de um usuário
     * @param {*} req Request
     * @param {*} res Response
     */
    static async editUser(req, res){
        //Armazena o token do usuário passado através do cabeçalho da requisiçao
        //Ex.: authorization = "Bearer sda3wbGciOi..."
        const { authorization } = req.headers;
        try{
            //Retorna uma string do token do usuário sem a palavra `Bearer`
            const user = await AuthService.getUserByToken(authorization);
            //Chama o método `edit` da classe UserService para realizar a edição do usuário
            await UserService.edit(req.body, user.id);
            //Retorna para o cliente uma mensagem de sucesso
            res.status(200).json({
                message : 'Informações atualizadas com sucesso!',
            });
        }catch(err){
            //Retorna para o cliente uma mensagem de erro caso a edição do usuário falhe
            res.status(500).json({
                message: err.message
            });
        }
    }
}