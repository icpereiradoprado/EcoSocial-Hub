// Importa o modelo PostModel para validação dos dados do post
import PostModel from "../models/PostModel.js";

// Importa o repositório PostRepository para manipulação dos dados no banco
import PostRepository from "../repositories/PostRepository.js";

// Classe de serviço para gerenciar operações relacionadas aos posts
export default class PostService{

    /**
     * Registra um novo post
     * @param {Object} postData Dados do post recebido na requisição
     * @returns {Object} Retorna o post criado
     */
    static async register(postData){
        try {
            // Valida o título e o conteúdo do post
            PostModel.validateTitle(postData.title);
            PostModel.validateContent(postData.content);

            // Cria o post no repositório
            const post = await PostRepository.create(postData);

            // Retorna o post criado
            return post;

        } catch (err) {
            // Lança um erro detalhado em caso de falha
            throw new Error(`Não foi possível registrar o conteúdo: ${err.message}`);
        }
    }

    /**
     * Deleta um post específico
     * @param {Object} postData Dados do post contendo o 'id'
     * @param {number} userId ID do usuário solicitante
     * @param {boolean} isAdmin Indica se o usuário tem permissões de administrador
     */
    static async delete(postData, userId, isAdmin){
        try{
            const { id } = postData;

            // Verifica se o 'id' do post é válido
            if(!id || id < 0){
               throw new Error("ID do post inválido");
            }

            // Remove o post usando o repositório
            await PostRepository.remove(id, userId, isAdmin);
        }catch(err){
            // Lança um erro detalhado em caso de falha
            throw new Error(`Não foi possível deletar o post: ${err.message}`);
        }
    }

    /**
     * Edita um post existente
     * @param {Object} postData Dados do post a serem atualizados
     * @param {number} postId ID do post a ser editado
     * @param {number} userId ID do usuário que solicita a edição
     * @returns {Object} Resultado da atualização do post
     */
    static async edit(postData, postId, userId){
        try{
            const { title, content, post_picture: postPicture, inactive } = postData;

            // Valida o título e o conteúdo do post
            PostModel.validateTitle(title);
            PostModel.validateContent(content);

            // Verifica se há dados para atualizar
            if (!Object.keys(postData).length) {
                throw new Error('Nenhum dado para atualizar');
            }

            // Filtra os campos que não são undefined e monta os pares coluna = valor
            const filteredUpdates = Object.entries(postData).filter(([key, value]) => value !== undefined);
            const columns = filteredUpdates.map(([key]) => key);
            const values = filteredUpdates.map(([_, value]) => value);

            // Verifica novamente se há dados válidos para atualização
            if (!Object.keys(postData).length || (columns.length < 1 || values.length < 1)) {
                throw new Error('Nenhum dado para atualizar');
            } else {
                // Caso exista algum valor, atualiza a coluna `update_date`
                postData.update_date = new Date().toISOString();
            }

            // Atualiza o post no repositório
            return await PostRepository.update(columns, values, postId, userId);
        }catch(err){
            // Lança um erro detalhado em caso de falha
            throw new Error(`Erro ao editar o post: ${err.message}`);
        }
    }

    /**
     * Obtém todos os posts com base em um offset
     * @param {Object} postData Dados necessários para a busca (offset)
     * @returns {Array} Lista de posts encontrados
     */
    static async getAll(postData){
        try{
            const { offset } = postData;

            // Busca todos os posts no repositório
            const posts = await PostRepository.findAll(offset);

            // Retorna os posts encontrados
            return posts;

        }catch(err){
            // Lança um erro detalhado em caso de falha
            throw new Error(`Não foi possivel carregar os posts: ${err.message}`);
        }
    }

    /**
     * Adiciona um voto positivo ao post
     * @param {Object} postData Dados contendo o userId e o postId
     */
    static async up(postData){
        try {
            const { user_id: userId, post_id: postId } = postData;

            // Adiciona o voto positivo usando o repositório
            await PostRepository.up(userId, postId);
        } catch (err) {
            // Lança um erro detalhado em caso de falha
            throw new Error(`Não foi possível concluir esta ação: ${err.message}`);
        }
    }

    /**
     * Adiciona um voto negativo ao post
     * @param {Object} postData Dados contendo o userId e o postId
     */
    static async down(postData){
        try {
            const { user_id: userId, post_id: postId } = postData;

            // Adiciona o voto negativo usando o repositório
            await PostRepository.down(userId, postId);
        } catch (err) {
            // Lança um erro detalhado em caso de falha
            throw new Error(`Não foi possível concluir esta ação: ${err.message}`);
        }
    }

    /**
     * Obtém os posts votados pelo usuário
     * @param {number} userId ID do usuário
     * @param {number} postId ID do post
     * @returns {Array} Lista de posts votados
     */
    static async postsVoted(userId, postId){
        try {
            // Retorna a lista de posts votados pelo usuário
            return await PostRepository.postsVoted(userId, postId);
        } catch (err) {
            // Lança um erro detalhado em caso de falha
            throw new Error(`Não concluir a requisição!: ${err.message}`);
        }
    }
}
