export default class UserModel {
    constructor(id, name, email, phoneNumber){
        this.id = id;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }

    static validate(userData){
        //Validations
        if(!userData.name){
            throw new Error('O nome é obrigatório!')
        }

        if(userData.name.length < 3){
            throw new Error('O nome deve ter no mínimo 3 caracteres!')
        }

        if(!userData.email){
            throw new Error('O email é obrigatório!');
        }

        if(!UserModel.isValidEmail(userData.email)){
            throw new Error('E-mail inválido!');
        }

        if(!userData.phone_number){
            throw new Error('O número de telefone é obrigatório!');
        }

        if(!userData.password){
            throw new Error('A senha é obrigatória!');
        }

        if(!userData.confirm_password){
            throw new Error('A confirmação da senha é obrigatória!');
        }

        if(userData.password !== userData.confirm_password){
            throw new Error('As senhas não coincidem!');
        }
    }

    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validateLoginData(userData){
        if(!userData.userIdentification){
            throw new Error('O campo de usuário ou e-mail é obrigatório!');
        }

        if(!userData.password){
            throw new Error('O campo de senha é obrigatório!');
        }
    }
}