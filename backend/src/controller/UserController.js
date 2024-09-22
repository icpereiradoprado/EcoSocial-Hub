import AuthService from "../services/AuthService.js";
import UserService from "../services/UserService.js";
import jwt from "jsonwebtoken";

export default class UserController {

    /**
     * Controlador para registrar um novo usuário 
     * @param {*} req Request
     * @param {*} res Resposta
     */
    static async registerUser(req, res){
        try{
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
            res.status(400).json({ error: err.message });
        }
    }

    /**
     * Controlador para deletar um usuário
     * @param {*} req Request
     * @param {*} res Response
     */
    static async deleteUser(req, res){
        //TODO: Criar uma validação para verificar se o usuário é um administrador ou o próprio usuário
        try{
            const message = await UserService.delete(req.params);
            res.status(200).json({ message });
        }catch(err){
            res.status(400).json({error : err.message});
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
                userId: user.id
            });

        }catch(err){
            res.status(422).json({message : err.message})
        }
    }

    /**
     * Controlador para validar o usuário logado
     * @param {*} req Request
     * @param {*} res Resposta
     */
    static async checkUser(req, res){
        let currentUser = null;
        const { authorization } = req.headers;
        if(authorization){
            const token = AuthService.getToken(authorization);
            const decoded = jwt.verify(token, process.env.SECRET);

            currentUser = await UserService.getUserById(decoded.id);
        }

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
            const user = await UserService.getUserById(id);
            res.status(200).json(user);
        }catch(err){
            res.status(422).json({ message : err.message});
        }
    }

    static async editUser(req, res){
        res.status(200).json({
            message : 'Deu certo update!',
        })
        return
    }
}