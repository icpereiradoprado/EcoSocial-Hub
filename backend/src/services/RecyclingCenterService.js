// Importa o modelo RecyclingCenterModel para validação dos dados do centro de reciclagem
import RecyclingCenterModel from "../models/RecyclingCenterModel.js";

// Importa o repositório RecyclingCenterRepository para manipulação dos dados no banco
import RecyclingCenterRepository from "../repositories/RecyclingCenterRepository.js";

// Classe de serviço para gerenciar operações relacionadas aos centros de reciclagem
export default class RecyclingCenterService{

    /**
     * Registra um novo ponto de coleta e descarte
     * @param {Object} recyclingCenterData Dados do centro de reciclagem recebido na requisição
     * @returns {Object} Retorna o centro de reciclagem criado
     */
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
            // Valida o nome e o endereço do centro de reciclagem
            RecyclingCenterModel.validateName(name);
            RecyclingCenterModel.validateAddress(street, number, postalCode, state, city);

            // Cria o centro de reciclagem no repositório
            const recyclingCenter = await RecyclingCenterRepository.create(recyclingCenterData);

            // Retorna o centro de reciclagem criado
            return recyclingCenter;

        } catch (err) {
            // Lança um erro detalhado em caso de falha
            throw new Error(`Não foi possível registrar o ponto de coleta e descarte: ${err.message}`);
        }
    }

    /**
     * Deleta um ponto de coleta e descarte específico
     * @param {Object} recyclingCenterData Dados do centro contendo o 'id'
     */
    static async delete(recyclingCenterData){
        try{
            const { id } = recyclingCenterData;

            // Verifica se o 'id' do centro de reciclagem é válido
            if(!id || id < 0){
               throw new Error("ID do conteúdo inválido");
            }

            // Remove o centro de reciclagem usando o repositório
            await RecyclingCenterRepository.remove(id);
        }catch(err){
            // Lança um erro detalhado em caso de falha
            throw new Error(`Não foi possível deletar o ponto de coleta e descarte: ${err.message}`);
        }
    }

    /**
     * Obtém todos os pontos de coleta e descarte com base no usuário
     * @param {Object} recyclingCenterData Dados necessários para a busca (userId)
     * @returns {Array} Lista de centros de reciclagem encontrados
     */
    static async getAll(recyclingCenterData){
        try{
            const { userId } = recyclingCenterData;

            // Busca todos os centros de reciclagem no repositório
            const contents = await RecyclingCenterRepository.findAll(userId);

            // Retorna os centros encontrados
            return contents;

        }catch(err){
            // Lança um erro detalhado em caso de falha
            throw new Error(`Não foi possivel carregar os pontos de coleta e descarte: ${err.message}`);
        }
    }

    /**
     * Edita um ponto de coleta e descarte existente
     * @param {Object} recyclingCenterData Dados do centro de reciclagem a serem atualizados
     * @param {number} id ID do centro a ser editado
     * @returns {Object} Resultado da atualização do centro de reciclagem
     */
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
                opening_hour: openingHour, 
                phone_number: phoneNumber 
            } = recyclingCenterData;

            // Valida o nome, caso esteja presente
            if(name){
                RecyclingCenterModel.validateName(name);
            }

            // Valida o endereço do centro de reciclagem
            RecyclingCenterModel.validateAddress(street, number, postalCode, state, city);

            // Verifica se há dados para atualizar
            if (!Object.keys(recyclingCenterData).length) {
                throw new Error('Nenhum dado para atualizar');
            }

            // Filtra os campos que não são undefined e monta os pares coluna = valor
            const filteredUpdates = Object.entries(recyclingCenterData).filter(([key, value]) => value !== undefined);
            const columns = filteredUpdates.map(([key]) => key);
            const values = filteredUpdates.map(([_, value]) => value);

            // Verifica novamente se há dados válidos para atualização
            if (!Object.keys(recyclingCenterData).length || (columns.length < 1 || values.length < 1)) {
                throw new Error('Nenhum dado para atualizar');
            } else {
                // Caso exista algum valor, atualiza a coluna `update_date`
                recyclingCenterData.update_date = new Date().toISOString();
            }

            // Realiza a atualização do centro de reciclagem usando o repositório
            return await RecyclingCenterRepository.update(columns, values, id);
        }catch(err){
            // Lança um erro detalhado em caso de falha
            throw new Error(`Erro ao editar o ponto de coleta e descarte: ${err.message}`);
        }
    }
}
