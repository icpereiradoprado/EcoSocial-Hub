/**Classe model para os Posts */
export default class UserModel {
    //Método construtor da classe
    constructor(id, name, email, phoneNumber){
        this.id = id;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }

    /**
     * Método que valida as informações do usuário
     * @param {Object} userData Objeto que representa um usuário
     */
    static validate(userData){
        //Caso o nome seja nulo ou undefined dispara um Erro
        if(!userData.name){
            throw new Error('O nome é obrigatório!')
        }

        //Caso o nome seja menor do que 3 caracteres dispara um Erro
        if(userData.name.length < 3){
            throw new Error('O nome deve ter no mínimo 3 caracteres!')
        }

        //Caso o email seja nulo ou undefined dispara um Erro
        if(!userData.email){
            throw new Error('O email é obrigatório!');
        }

        //Caso o e-mail seja inválido dispara um Erro
        if(!UserModel.isValidEmail(userData.email)){
            throw new Error('E-mail inválido!');
        }

        //Caso o número de telefone seja nulo ou undefined dispara um Erro
        if(!userData.phone_number){
            throw new Error('O número de telefone é obrigatório!');
        }

        //Caso a senha seja nula ou undefined dispara um Erro
        if(!userData.password){
            throw new Error('A senha é obrigatória!');
        }

        //Caso a senha seja menor do que 2 caracteres dispara um Erro
        if(userData.password.length < 2){
            throw new Error('A senha deve ter no mínimo 2 caracteres');
        }

        //Caso a confirmação da senha seja nula ou undefined dispara um Erro
        if(!userData.confirm_password){
            throw new Error('A confirmação da senha é obrigatória!');
        }

        //Caso as senhas não se coincidam dispara um Erro
        if(userData.password !== userData.confirm_password){
            throw new Error('As senhas não coincidem!');
        }
    }

    /**
     * Valida se o e-mail é válido
     * @param {string} email E-mail do usuário
     * @returns 
     */
    static isValidEmail(email) {
        //Regex para validar se o valor do parâmetro segue a estrutura de um endereço de e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        //Testa o valor do parâmetro com a regex, caso seja válido retorna True, caso contrário, False
        return emailRegex.test(email);
    }

    /**
     * 
     * @param {Object} userData Objeto que representa um usuário
     */
    static validateLoginData(userData){
        //Caso o parâmetro `userIdentification` seja nulo ou undefined dispara um Erro
        if(!userData.userIdentification){
            throw new Error('O campo de usuário ou e-mail é obrigatório!');
        }

        //Caso a senha seja nula ou undefined dispara um Erro
        if(!userData.password){
            throw new Error('O campo de senha é obrigatório!');
        }
    }
}