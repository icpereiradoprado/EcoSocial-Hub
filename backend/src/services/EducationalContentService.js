import EducationalContentRepository from "../repositories/EducationalContentRepository.js";
import EducationalContentModel from "../models/EducationalContentModel.js";

export default class EducationalContentService{

    static async register(contentData){
        try {
            EducationalContentModel.validateTitle(contentData.title);
            EducationalContentModel.validateContent(contentData.content);
            if(contentData.tag){
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

    static async getAll(){
        try{
            const contents = await EducationalContentRepository.findAll();
            
            return contents;
            
        }catch(err){
            throw new Error(`Não foi possivel carregar os conteúdos: ${err.message}`);
        }
    }

    static async edit(){

    }
}