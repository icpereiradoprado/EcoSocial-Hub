export default class RecyclingCenterModel{
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

    static validateName(name){
        if(!name && name.length <= 0){
            throw new Error("O campo 'nome' é obrigatório!");
        }
    }

    static validateAddress(street, number, postalCode, state, city){
        if(!street && street.length <= 0 || 
            !number && number.toString().length <= 0 ||
            !postalCode && postalCode.toString().length <= 0 || 
            !state && state.length <= 0 ||
            !city && city.length <= 0){
            throw new Error("Endereço inválido preencha os campos obrigatórios: 'Rua', 'Número', 'CEP', 'Estado' e 'Cidade'");
        }
    }

    static validateName(validateOpeningHour){
        if(!validateOpeningHour){
            throw new Error("O campo 'Horário de funcionamento' é obrigatório!");
        }
    }
}