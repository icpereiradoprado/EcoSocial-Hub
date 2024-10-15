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

    static async edit(recyclingCenterData, id){
        try{
            const { 
                name, 
                street, 
                number, 
                complement, 
                postal_code: postalCode, 
                state, 
                city, 
                opening_hour: openingHOur, 
                phone_number: phoneNumber 
            } = recyclingCenterData;


            if(name){
                RecyclingCenterModel.validateName(name);
            }
            
            RecyclingCenterModel.validateAddress(street, number, postalCode, state, city);
    
            if (!Object.keys(recyclingCenterData).length) {
                throw new Error('Nenhum dado para atualizar');
            }
    
            // Filtra os campos que não são undefined e monta os pares coluna = valor
            const filteredUpdates = Object.entries(recyclingCenterData).filter(([key, value]) => value !== undefined);
            const columns = filteredUpdates.map(([key]) => key);
            const values = filteredUpdates.map(([_, value]) => value);
    
            if (!Object.keys(recyclingCenterData).length || (columns.length < 1 || values.length < 1)) {
                throw new Error('Nenhum dado para atualizar');
            }else{
                //Caso exista algum valor atualiza a coluna `update_date`
                recyclingCenterData.update_date = new Date().toISOString();
            }
    
            return await RecyclingCenterRepository.update(columns, values, id);
        }catch(err){
            throw new Error(`Erro ao editar o ponto de coleta e descarte: ${err.message}`);
        }
    }
}