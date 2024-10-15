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

    static async delete(recyclingCenterData){
        try{
            const { id } = recyclingCenterData;
            if(!id || id < 0){
               throw new Error("ID do coteúdo inválido");
            }

            await RecyclingCenterRepository.remove(id);
        }catch(err){
            throw new Error(`Não foi possível deletar o ponto de coleta e descarte: ${err.message}`);
        }
    }

    static async getAll(recyclingCenterData){
        try{
            const { userId } = recyclingCenterData;
            const contents = await RecyclingCenterRepository.findAll(userId);
            
            return contents;
            
        }catch(err){
            throw new Error(`Não foi possivel carregar os pontos de coleta e descarte: ${err.message}`);
        }
    }

    static async edit(){}
}