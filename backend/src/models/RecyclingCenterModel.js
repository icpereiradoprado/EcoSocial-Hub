/**Classe model para os Posts */
export default class RecyclingCenterModel{
    //Método construtor da classe
    constructor(name, street, number, complement, postalCode, state, city, openingHour, phoneNumber)   {
        this.name = name;
        this.street = street;
        this.number = number;
        this.complement = complement;
        this.postalCode = postalCode;
        this.state = state;
        this.city = city;
        this.openingHour = openingHour;
        this.phoneNumber = phoneNumber;
    }

    /**
     * Método que valida o nome do Ponto de Reciclagem
     * @param {string} name nome do local
     */
    static validateName(name){
        //Caso o nome seja nulo ou undefined e o nome seja vazio dispara um Erro
        if(!name && name.length <= 0){
            throw new Error("O campo 'nome' é obrigatório!");
        }
    }

    /**
     * Método que valida o endereço do Ponto de Reciclagem
     * @param {*} street nome da rua
     * @param {*} number número do local
     * @param {*} postalCode Código Postal (CEP)
     * @param {*} state Estado
     * @param {*} city Cidade
     */
    static validateAddress(street, number, postalCode, state, city){
        //Caso algum dos parâmetros seja nulo ou undefined e seja vazio
        //Dispara um Erro
        if(!street && street.length <= 0 || 
            !number && number.toString().length <= 0 ||
            !postalCode && postalCode.toString().length <= 0 || 
            !state && state.length <= 0 ||
            !city && city.length <= 0){
            throw new Error("Endereço inválido preencha os campos obrigatórios: 'Rua', 'Número', 'CEP', 'Estado' e 'Cidade'");
        }
    }

    /**
     * Método que valida o horário de funcionamento
     * @param {string} openingHour 
     */
    static validateOpeningHour(openingHour){
        //Caso o valor do parâmetro seja nulo ou undefined dispara um Erro
        if(!openingHour){
            throw new Error("O campo 'Horário de funcionamento' é obrigatório!");
        }
    }
}