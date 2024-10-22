import CommentModel from "../models/CommentModel.js";
import CommentRepository from "../repositories/CommentRepository.js";

export default class CommentService{

    static async register(commentData){
        try {
            CommentModel.validateContent(commentData.content);

            const comment = await CommentRepository.create(commentData);

            return comment;

        } catch (err) {
            throw new Error(`Não foi possível registrar o conteúdo: ${err.message}`);
        }
    }

    static async delete(commentData, userId, isAdmin){
        try{
            const { id } = commentData;
            if(!id || id < 0){
               throw new Error("ID do comentário inválido");
            }

            await CommentRepository.remove(id, userId, isAdmin);
        }catch(err){
            throw new Error(`Não foi possível deletar o comentário: ${err.message}`);
        }
    }

    static async edit(commentData, postId, userId){
        try{
            const { content } = commentData;
            
            CommentModel.validateContent(content);
            
            //Insere a data de atualização
            commentData.update_date = new Date().toISOString();
    
            if (!Object.keys(commentData).length) {
                throw new Error('Nenhum dado para atualizar');
            }
    
            // Filtra os campos que não são undefined e monta os pares coluna = valor
            const filteredUpdates = Object.entries(commentData).filter(([key, value]) => value !== undefined);
            const columns = filteredUpdates.map(([key]) => key);
            const values = filteredUpdates.map(([_, value]) => value);
            
            if (!Object.keys(commentData).length || (columns.length < 1 || values.length < 1)) {
                throw new Error('Nenhum dado para atualizar');
            }
    
            return await CommentRepository.update(columns, values, postId, userId);
        }catch(err){
            throw new Error(`Erro ao editar o comentário: ${err.message}`);
        }
    }

    static async getAll(commentData){
        try{
            const { postId, offset, commentParent } = commentData;
            const posts = await CommentRepository.findAll(postId, offset, commentParent);
            
            return posts;
            
        }catch(err){
            throw new Error(`Não foi possivel carregar os comentários: ${err.message}`);
        }
    }
}