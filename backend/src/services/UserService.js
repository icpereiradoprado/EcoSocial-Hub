import UserModel from "../models/UserModel.js";
import UserRepository from "../repositories/UserRepository.js";
import bcrypt from 'bcrypt';

export default class UserService{
    static async register(userData){

        //Valida os dados do usuário usando o Model
        UserModel.validate(userData);
        
        //Busca um usuário pelo nome ou e-mail
        const existingUser = await UserRepository.findByNameOrEmail(userData.name, userData.email);

        //Se o usuário já estiver cadastrado para a requisição e sobe erro
        if(existingUser){
            throw new Error('Usuário já cadastrado! Tente um novo nome ou um novo e-mail.');
        }

        //Cria uma senha criptografada
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(userData.password, salt);

        //Chama o método para inserir um novo usuário.
        const user = await UserRepository.create(userData, passwordHash);
        return user;
    }

    /**
     * Serviço que irá tratar os dados da requisição e irá chamar o método para a remoção do usuário
     * @param {UserModel} userData 
     */
    static async delete(userData){
        const { name, email } = userData;
        const existingUser = await UserRepository.findByNameOrEmail(name, email);

        if(!existingUser){
            throw new Error('O usuário não existe!');
        }

        await UserRepository.remove(existingUser.id);

        return 'Usuário removido com sucesso!';
    }

    /**
     * Serviço que irá buscar um usuário pelo id
     * @param {Number} id Id do usuário
     * @returns UserModel
     */
    static async getUserById(id){
        const user = await UserRepository.findById(id);
        if(!user){
            throw new Error('Usuário não encontrado!');
        }
        
        return user;
    }

    /**
     * 
     * @param {UserModel} userData 
     * @param {*} userId 
     */
    static async edit(userData, userId){
        const { name, email, password, confirm_password: confirmPassword } = userData;

        if(name && name.length >= 3){
            const user = await UserRepository.findByNameOrEmail(name);
            if(user){
                throw new Error('Nome de usuário já cadastrado!');
            }
        }else{
            userData.name = undefined;
        }
        
        if(email && email.length > 0){
            if(!UserModel.isValidEmail(email)){
                throw new Error('E-mail inválido!');
            }
            const user = await UserRepository.findByNameOrEmail(null, email);

            if(user){
                throw new Error('E-mail já cadastrado!')
            }
        }

        let passwordHash = null;
        if(password && password.length > 1 && (password !== confirmPassword)){
            throw new Error('As senhas não coincidem!');
        }else if(password && (password === confirmPassword)){
            //Cria uma senha criptografada
            const salt = await bcrypt.genSalt(12);
            passwordHash = await bcrypt.hash(userData.password, salt);

            //Altera o valor da propriedade password para o valor criptografado
            userData.password = passwordHash;
            //Limpa o valor da propriedade confirm_password para que ela não seja passada dentro da QUERY
            userData.confirm_password = undefined;
        }else{
            //Limpa o valor da propriedade password e confirm_password para que elas não sejam passadas dentro da QUERY
            userData.password = undefined;
            userData.confirm_password = undefined;
        }

        if (!Object.keys(userData).length) {
            throw new Error('Nenhum dado para atualizar');
        }

        // Filtra os campos que não são undefined e monta os pares coluna = valor
        const filteredUpdates = Object.entries(userData).filter(([key, value]) => value !== undefined);
        const columns = filteredUpdates.map(([key]) => key);
        const values = filteredUpdates.map(([_, value]) => value);

        if (!Object.keys(userData).length || (columns.length < 1 || values.length < 1)) {
            throw new Error('Nenhum dado para atualizar');
        }


        await UserRepository.update(columns, values, userId);
    }
}