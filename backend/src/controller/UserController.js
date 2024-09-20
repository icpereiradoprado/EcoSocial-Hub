import AuthService from "../services/AuthService.js";
import UserService from "../services/UserService.js";

export default class UserController {
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

    static async deleteUser(req, res){
        //TODO: Criar uma validação para verificar se o usuário é um administrador ou o próprio usuário
        try{
            const message = await UserService.delete(req.params);
            res.status(200).json({ message });
        }catch(err){
            res.status(400).json({error : err.message});
        }
    }

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
}