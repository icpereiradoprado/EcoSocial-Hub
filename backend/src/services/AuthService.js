// Importa jwt para criação e verificação de tokens JWT
import jwt from 'jsonwebtoken';
// Importa o modelo de usuário para validação e manipulação dos dados do usuário
import UserModel from '../models/UserModel.js';
// Importa o repositório de usuários para interagir com o banco de dados
import UserRepository from '../repositories/UserRepository.js';
// Importa bcrypt para hashing e comparação de senhas
import bcrypt from 'bcrypt';

// Classe de serviço para gerenciar operações de autenticação de usuários
export default class AuthService {

    /**
     * Gera um token de autenticação para o usuário
     * @param {UserModel} user - Objeto que representa um Usuário
     * @returns {string} - Token JWT do usuário
     */
    static async createUserToken(user) {
        // Cria o token com o nome, id e permissão do usuário
        const token = jwt.sign({
            name: user.name,
            id: user.id,
            isAdmin: user.is_admin
        }, process.env.SECRET);

        return token;
    }

    /**
     * Serviço que realiza o login do usuário
     * @param {Object} userData - Objeto contendo userIdentification e password
     * @returns {Object} - Retorna o usuário e o token de autenticação
     */
    static async login(userData) {
        // Valida os dados de login fornecidos
        UserModel.validateLoginData(userData);

        // Busca o usuário pelo nome ou e-mail
        const user = await this.checkNameOrEmail(userData.userIdentification.trim());

        // Se o usuário não for encontrado, lança um erro
        if (!user) {
            throw new Error('Não há usuário cadastrado com este nome de usuário ou e-mail!');
        }

        // Verifica se a senha fornecida corresponde à senha do usuário
        await this.checkUserPassword(userData.password.trim(), user.password);

        // Gera um token de autenticação para o usuário
        const token = await this.createUserToken(user);
        return { user, token };
    }

    /**
     * Verifica se o nome ou e-mail fornecido corresponde a um usuário cadastrado
     * @param {string} userIdentification - Nome ou e-mail do usuário
     * @returns {UserModel} - Usuário correspondente
     */
    static async checkNameOrEmail(userIdentification) {
        // Valida se userIdentification é um e-mail ou nome de usuário e retorna o usuário
        if (UserModel.isValidEmail(userIdentification)) {
            return await UserRepository.findByNameOrEmail(null, userIdentification);
        } else {
            return await UserRepository.findByNameOrEmail(userIdentification, null);
        }
    }

    /**
     * Valida a senha do usuário
     * @param {string} password - Senha fornecida na requisição
     * @param {string} userPassword - Senha criptografada do usuário cadastrado
     */
    static async checkUserPassword(password, userPassword) {
        const checkPassword = await bcrypt.compare(password, userPassword);

        if (!checkPassword) {
            throw new Error('Senha inválida!');
        }
    }

    /**
     * Retorna o token de autenticação a partir do cabeçalho de autorização
     * @param {string} authorization - Cabeçalho de autorização contendo o token
     * @returns {string|null} - Token de autenticação ou null se não existir
     */
    static getToken(authorization) {
        if (!authorization) {
            return null;
        }
        // Divide o cabeçalho em partes e retorna o token
        const token = authorization.split(' ')[1];
        return token;
    }

    /**
     * Middleware para validar o token
     * @param {*} req - Objeto de requisição
     * @param {*} res - Objeto de resposta
     * @param {*} next - Função de middleware
     */
    static async checkToken(req, res, next) {
        const { authorization } = req.headers;
        const token = AuthService.getToken(authorization);

        if (!token) {
            return res.status(401).json({ message: 'Acesso Negado!' });
        }

        try {
            // Verifica e decodifica o token
            const verified = jwt.verify(token, process.env.SECRET);
            req.user = verified;
            next(); // Permite que o middleware continue se o token for válido
        } catch (err) {
            return res.status(400).json({ message: 'Token inválido!' });
        }
    }

    /**
     * Obtém um usuário através do token de autenticação
     * @param {string} authorization - Cabeçalho de autorização
     * @returns {UserModel} - Usuário correspondente ao token
     */
    static async getUserByToken(authorization) {
        const token = AuthService.getToken(authorization);

        if (!token) {
            throw new Error('Acesso Negado!');
        }

        // Decodifica o token e obtém o ID do usuário
        const decoded = jwt.verify(token, process.env.SECRET);
        const userId = decoded.id;

        // Busca o usuário pelo ID no repositório de usuários
        const user = await UserRepository.findById(userId);

        if (!user) {
            throw new Error('Usuário não encontrado!');
        }

        return user;
    }
}
