export default class RecyclingCenterService{
    static async register(recyclingCenterData){
        const { 
            name, 
            street, 
            number, 
            complement, 
            postal_code: postalCode, 
            state, 
            city, 
            opening_hour: openingHour, 
            phone_number: phoneNumber 
        } = recyclingCenterData;

        
    }

    static async delete(){}

    static async getAll(){}

    static async edit(){}
}