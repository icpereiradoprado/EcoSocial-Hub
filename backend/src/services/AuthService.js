import jwt from 'jsonwebtoken'

export default class AuthService{
    
    static async createUserToken(user, req, res){

        //Cria o token
        const token = jwt.sign({
            name: user.name,
            id: user.id
        }, "nossosecret");

        //retorna o token
        res.status(200).json({
            message: "Você está autenticado!",
            token: token,
            userId: user.id
        });
    }
}

