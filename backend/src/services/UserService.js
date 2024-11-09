// Importa o modelo UserModel para validação dos dados do usuário
import UserModel from "../models/UserModel.js";

// Importa o repositório UserRepository para manipulação dos dados do usuário no banco
import UserRepository from "../repositories/UserRepository.js";

// Importa o módulo bcrypt para criptografia de senha
import bcrypt from 'bcrypt';

// Classe de serviço para gerenciar operações relacionadas aos usuários
export default class UserService{

    /**
     * Registra um novo usuário
     * @param {Object} userData Dados do usuário passado pela requisição
     * @returns {Object} Retorna o usuário criado
     */
    static async register(userData){
        
        // Valida os dados do usuário usando o Model
        UserModel.validate(userData);

        // Busca um usuário pelo nome ou e-mail
        const existingUser = await UserRepository.findByNameOrEmail(userData.name, userData.email);

        // Verifica se o usuário já está cadastrado e lança erro caso esteja
        if(existingUser){
            throw new Error('Usuário já cadastrado! Tente um novo nome ou um novo e-mail.');
        }

        // Cria uma senha criptografada
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(userData.password.trim(), salt);

        // Chama o método para inserir um novo usuário no repositório
        const user = await UserRepository.create(userData, passwordHash);

        // Retorna o usuário criado
        return user;
    }

    /**
     * Serviço que irá tratar os dados da requisição e chamar o método para a remoção do usuário
     * @param {Object} userData Dados do usuário contendo nome e e-mail
     * @returns {String} Mensagem de sucesso ao remover usuário
     */
    static async delete(userData){
        const { name, email } = userData;

        // Busca o usuário pelo nome e e-mail
        const existingUser = await UserRepository.findByNameOrEmail(name, email);

        // Verifica se o usuário existe, caso contrário, lança um erro
        if(!existingUser){
            throw new Error('O usuário não existe!');
        }

        // Remove o usuário usando o repositório
        await UserRepository.remove(existingUser.id);

        // Retorna mensagem de sucesso
        return 'Usuário removido com sucesso!';
    }

    /**
     * Serviço que busca um usuário pelo ID
     * @param {Number} id ID do usuário
     * @returns {Object} Usuário encontrado
     */
    static async getUserById(id){
        // Busca o usuário pelo ID
        const user = await UserRepository.findById(id);

        // Verifica se o usuário foi encontrado
        if(!user){
            throw new Error('Usuário não encontrado!');
        }

        // Retorna o usuário encontrado
        return user;
    }

    /**
     * Serviço que edita os dados de um usuário
     * @param {Object} userData Dados do usuário a serem atualizados
     * @param {Number} userId ID do usuário a ser editado
     */
    static async edit(userData, userId){
        const { name, email, password, confirm_password: confirmPassword } = userData;

        // Valida e verifica se o nome do usuário já está cadastrado
        if(name && name.length >= 3){
            const user = await UserRepository.findByNameOrEmail(name);
            if(user){
                throw new Error('Nome de usuário já cadastrado!');
            }
        } else {
            userData.name = undefined;
        }

        // Valida e verifica o e-mail do usuário
        if(email && email.length > 0){
            if(!UserModel.isValidEmail(email)){
                throw new Error('E-mail inválido!');
            }
            const user = await UserRepository.findByNameOrEmail(null, email);

            if(user){
                throw new Error('E-mail já cadastrado!');
            }
        }

        // Lógica para validação e criptografia da senha
        let passwordHash = null;
        if(password && password.length > 1 && (password !== confirmPassword)){
            throw new Error('As senhas não coincidem!');
        } else if(password && (password === confirmPassword)){
            // Cria uma senha criptografada
            const salt = await bcrypt.genSalt(12);
            passwordHash = await bcrypt.hash(userData.password, salt);

            // Atualiza o valor da senha para o valor criptografado
            userData.password = passwordHash;

            // Limpa o campo de confirmação de senha para que não seja passado para a query
            userData.confirm_password = undefined;
        } else {
            // Limpa os campos de senha e confirmação de senha para não serem passados na query
            userData.password = undefined;
            userData.confirm_password = undefined;
        }

        // Verifica se há dados para atualizar
        if (!Object.keys(userData).length) {
            throw new Error('Nenhum dado para atualizar');
        }

        // Filtra os campos que não são undefined e monta os pares coluna = valor
        const filteredUpdates = Object.entries(userData).filter(([key, value]) => value !== undefined);
        const columns = filteredUpdates.map(([key]) => key);
        const values = filteredUpdates.map(([_, value]) => value);

        // Verifica novamente se há dados válidos para atualização
        if (!Object.keys(userData).length || (columns.length < 1 || values.length < 1)) {
            throw new Error('Nenhum dado para atualizar');
        }

        // Realiza a atualização do usuário no repositório
        await UserRepository.update(columns, values, userId);
    }
}
