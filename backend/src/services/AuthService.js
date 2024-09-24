import jwt from 'jsonwebtoken'
import UserModel from '../models/UserModel.js';
import UserRepository from '../repositories/UserRepository.js';
import bcrypt from 'bcrypt';

export default class AuthService{
    
    /**
     * Cria o token do usuário
     * @param {UserModel} user Objeto que representa um Usuário
     * @param {*} req Requisição
     * @param {*} res Resposta
     */
    static async createUserToken(user){
        //Cria o token
        const token = jwt.sign({
            name: user.name,
            id: user.id
        }, process.env.SECRET);

        return token;
    }


    /**
     * Serviço que realiza o login do usuário
     * @param {Object} userData Objeto passado pela requisição { userIdentification, password}
     */
    static async login(userData, req, res){
        //Valida se os dados para o login foram passados corretamente
        UserModel.validateLoginData(userData);
        
        //Verifica se existe um usuário cadastrado com o nome ou e-mail passado. Caso exista, retorna o usuário
        const user = await this.checkNameOrEmail(userData.userIdentification);

        //Se o usuário já estiver cadastrado para a requisição e sobe erro
        if(!user){
            throw new Error('Não há usuário cadastrado com este nome de usuário ou e-mail!');
        }

        //Verifica se a senha do usuário é válida
        await this.checkUserPassword(userData.password, user.password);

        const token = await this.createUserToken(user);
        return {user, token};
    }

    /**
     * Verifica se o valor passado para o login é valido, ou seja, se pertence à um usuário cadastrado.
     * @param {string} userIdentification Nome ou e-mail do usuário
     * @returns Retorna o usuário
     */
    static async checkNameOrEmail(userIdentification){
        //Valida se o valor passado para o campo de login é um e-mail
        if(UserModel.isValidEmail(userIdentification)){
            //Caso seja um e-mail passa o nome do usuário como nulo e verifica se existe algum usuário cadastrado com o e-mail fornecido
            return await UserRepository.findByNameOrEmail(null, userIdentification);
        }else{
            //Caso constrário passa o e-mail do usuário como nulo e verifica se existe algum usuário cadastrado com o nome fornecido
            return await UserRepository.findByNameOrEmail(userIdentification, null);
        }
    }

    /**
     * Valida a senha de um usuário
     * @param {string} password Senha passada pela requisição
     * @param {string} userPassword Senha criptografada do usuário cadastrado
     */
    static async checkUserPassword(password, userPassword){
        const checkPassword = await bcrypt.compare(password, userPassword);

        if(!checkPassword){
            throw new Error('Senha inválida!');
        }
    }

    /**
     * Extrai o token obtido através do header da requisição e retorna o token
     * @param {string} authorization 
     * @returns Token
     */
    static getToken(authorization){
        if(!authorization){
            return null;
        }
        //Divide a string por um espaço e pega o segundo item do array
        //exemplo do formato de authorization: Bearer sda3wbGciOi...
        const token = authorization.split(' ')[1];// exeplo de valor obtido: sda3wbGciOi...

        return token;
    }

    /**
     * Middleware para validar o token
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next função que faz parte da assinatura dos middlewares
     */
    static async checkToken(req, res, next){
        const { authorization } = req.headers;
        const token = AuthService.getToken(authorization);

        if(!token){
            res.status(401).json({ message: 'Acesso Negado!' });
        }

        try{
            const verified = jwt.verify(token, process.env.SECRET);
            req.user = verified;
            next(); // Caso o token exista, o next permite continuar com o middleware
        }catch(err){
            res.status(400).json({ message: 'Token inválido!' });
        }
    }


    /**
     * Pega um usuário através do token de autenticação
     * @param {*} authorization Autorização do Header da requisição
     * @returns UserModel
     */
    static async getUserByToken(authorization){
        const token = AuthService.getToken(authorization);

        if(!token){
            res.status(401).json({ message: 'Acesso Negado!' });
        }

        const decoded = jwt.verify(token, process.env.SECRET);

        const userId = decoded.id;

        const user = await UserRepository.findById(userId);

        if(!user){
            throw new Error('Usuário não encontrado!');
        }

        return user;
    }

}

