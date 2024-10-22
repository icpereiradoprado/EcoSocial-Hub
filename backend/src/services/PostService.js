import PostModel from "../models/PostModel.js";
import PostRepository from "../repositories/PostRepository.js";

export default class PostService{

    static async register(postData){
        try {
            PostModel.validateTitle(postData.title);
            PostModel.validateContent(postData.content);

            const post = await PostRepository.create(postData);

            return post;

        } catch (err) {
            throw new Error(`Não foi possível registrar o conteúdo: ${err.message}`);
        }
    }

    static async delete(postData, userId, isAdmin){
        try{
            const { id } = postData;
            if(!id || id < 0){
               throw new Error("ID do post inválido");
            }

            await PostRepository.remove(id, userId, isAdmin);
        }catch(err){
            throw new Error(`Não foi possível deletar o post: ${err.message}`);
        }
    }

    static async edit(postData, postId, userId){
        try{
            const { title, content, post_picture: postPicture, inactive } = postData;
            
            PostModel.validateTitle(title);
            PostModel.validateContent(content);
    
            if (!Object.keys(postData).length) {
                throw new Error('Nenhum dado para atualizar');
            }
    
            // Filtra os campos que não são undefined e monta os pares coluna = valor
            const filteredUpdates = Object.entries(postData).filter(([key, value]) => value !== undefined);
            const columns = filteredUpdates.map(([key]) => key);
            const values = filteredUpdates.map(([_, value]) => value);
    
            if (!Object.keys(postData).length || (columns.length < 1 || values.length < 1)) {
                throw new Error('Nenhum dado para atualizar');
            }else{
                //Caso exista algum valor atualiza a coluna `update_date`
                postData.update_date = new Date().toISOString();
            }
    
            return await PostRepository.update(columns, values, postId, userId);
        }catch(err){
            throw new Error(`Erro ao editar o post: ${err.message}`);
        }
    }

    static async getAll(){
        try{
            const posts = await PostRepository.findAll();
            
            return posts;
            
        }catch(err){
            throw new Error(`Não foi possivel carregar os posts: ${err.message}`);
        }
    }

    static async up(postData){
        try {
            const { user_id: userId, post_id: postId } = postData;
            await PostRepository.up(userId, postId);
        } catch (err) {
            throw new Error(`Não foi possível concluir esta ação: ${err.message}`);
        }
    }

    static async down(postData){
        try {
            const { user_id: userId, post_id: postId } = postData;
            await PostRepository.down(userId, postId);
        } catch (err) {
            throw new Error(`Não foi possível concluir esta ação: ${err.message}`);
        }
    }

}