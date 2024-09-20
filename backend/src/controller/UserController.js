import UserService from "../services/UserService.js";

export default class UserController {
    static async registerUser(req, res){
        try{
            const user = await UserService.register(req.body);
            res.status(201).json(user);
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
}