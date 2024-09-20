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
        }, "nossosecret");

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

}

