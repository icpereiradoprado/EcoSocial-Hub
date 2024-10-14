import RecyclingCenterModel from "../models/RecyclingCenterModel.js";
import RecyclingCenterRepository from "../repositories/RecyclingCenterRepository.js";

export default class RecyclingCenterService{
    static async register(recyclingCenterData){
        const { 
            name, 
            street, 
            number, 
            postal_code: postalCode, 
            state, 
            city
        } = recyclingCenterData;

        try {
            RecyclingCenterModel.validateName(name);
            RecyclingCenterModel.validateAddress(street, number, postalCode, state, city);

            const recyclingCenter = await RecyclingCenterRepository.create(recyclingCenterData);

            return recyclingCenter;

        } catch (err) {
            throw new Error(`Não foi possível registrar o ponto de coleta e descarte: ${err.message}`);
        }

        
    }

    static async delete(){}

    static async getAll(){}

    static async edit(){}
}