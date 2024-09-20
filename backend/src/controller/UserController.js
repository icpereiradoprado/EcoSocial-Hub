import AuthService from "../services/AuthService.js";
import UserService from "../services/UserService.js";

export default class UserController {
    static async registerUser(req, res){
        try{
            const user = await UserService.register(req.body);

            //Autentica o novo usuário
            await AuthService.createUserToken(user, req, res);
            
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

    static async loginUser(){
        
    }
}