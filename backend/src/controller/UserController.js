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
}