import EducationalContentRepository from "../repositories/EducationalContentRepository.js";
import EducationalContentModel from "../models/EducationalContentModel.js";

export default class EducationalContentService{

    static async register(contentData){
        try {
            EducationalContentModel.validateTitle(contentData.title);
            EducationalContentModel.validateContent(contentData.content);
            if(contentData.tag && Array.isArray(contentData.tag)){
                const tags = contentData.tag;
                tags.forEach((tag)=>{ 
                    EducationalContentModel.validateTag(tag);
                })
                contentData.tag = tags.join(';');
            }

            const content = await EducationalContentRepository.create(contentData);

            return content;

        } catch (err) {
            throw new Error(`Não foi possível registrar o conteúdo: ${err.message}`);
        }
    }

    static async delete(contentData){
        try{
            const { id } = contentData;
            if(!id || id < 0){
               throw new Error("ID do coteúdo inválido");
            }

            await EducationalContentRepository.remove(id);
        }catch(err){
            throw new Error(`Não foi possível deletar o conteúdo: ${err.message}`);
        }
    }

    static async getAll(contentData){
        try{
            const { offset } = contentData;
            const contents = await EducationalContentRepository.findAll(offset);
            
            return contents;
            
        }catch(err){
            throw new Error(`Não foi possivel carregar os conteúdos: ${err.message}`);
        }
    }

    static async edit(contentData, contentId, userId){
        try{
            const { title, content, tag } = contentData;
            
            EducationalContentModel.validateTitle(title);
            EducationalContentModel.validateContent(content);

            if(tag && Array.isArray(tag)){
                const tags = contentData.tag;
                tags.forEach((tag)=>{ 
                    EducationalContentModel.validateTag(tag);
                })
                contentData.tag = tags.join(';');
            }
    
            if (!Object.keys(contentData).length) {
                throw new Error('Nenhum dado para atualizar');
            }
    
            // Filtra os campos que não são undefined e monta os pares coluna = valor
            const filteredUpdates = Object.entries(contentData).filter(([key, value]) => value !== undefined);
            const columns = filteredUpdates.map(([key]) => key);
            const values = filteredUpdates.map(([_, value]) => value);
    
            if (!Object.keys(contentData).length || (columns.length < 1 || values.length < 1)) {
                throw new Error('Nenhum dado para atualizar');
            }else{
                //Caso exista algum valor atualiza a coluna `update_date`
                contentData.update_date = new Date().toISOString();
            }
    
            return await EducationalContentRepository.update(columns, values, contentId, userId);
        }catch(err){
            throw new Error(`Erro ao editar o conteúdo: ${err.message}`);
        }
    }
}