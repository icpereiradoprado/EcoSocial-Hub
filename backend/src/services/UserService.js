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
}