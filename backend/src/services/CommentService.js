// Importa o modelo de comentário para validar e estruturar os dados de comentários
import CommentModel from "../models/CommentModel.js";
// Importa o repositório de comentários para interagir com a camada de dados (banco de dados)
import CommentRepository from "../repositories/CommentRepository.js";
// Classe de serviço para gerenciar operações relacionadas a comentários
export default class CommentService {

    /**
     * Registra um novo comentário
     * @param {Object} commentData Dados do comentário passado pela requisição
     * @returns {Object} Retorna o comentário criado
     */
    static async register(commentData) {
        try {
            // Valida o conteúdo do comentário
            CommentModel.validateContent(commentData.content);

            // Cria o comentário usando o repositório
            const comment = await CommentRepository.create(commentData);

            // Retorna o comentário criado
            return comment;

        } catch (err) {
            // Lança um erro detalhado caso algo dê errado
            throw new Error(`Não foi possível registrar o conteúdo: ${err.message}`);
        }
    }

    /**
     * Deleta um comentário específico
     * @param {Object} commentData Dados do comentário contendo o 'id'
     * @param {number} userId ID do usuário que está solicitando a exclusão
     * @param {boolean} isAdmin Flag para verificar se o usuário é um administrador
     */
    static async delete(commentData, userId, isAdmin) {
        try {
            const { id } = commentData;

            // Verifica se o 'id' do comentário é válido
            if (!id || id < 0) {
                throw new Error("ID do comentário inválido");
            }

            // Remove o comentário usando o repositório
            await CommentRepository.remove(id, userId, isAdmin);
        } catch (err) {
            // Lança um erro detalhado caso algo dê errado
            throw new Error(`Não foi possível deletar o comentário: ${err.message}`);
        }
    }

    /**
     * Edita um comentário existente
     * @param {Object} commentData Dados do comentário a serem atualizados
     * @param {number} postId ID do post ao qual o comentário pertence
     * @param {number} userId ID do usuário que está solicitando a edição
     * @returns {Object} Resultado da atualização do comentário
     */
    static async edit(commentData, postId, userId) {
        try {
            const { content } = commentData;

            // Valida o conteúdo do comentário
            CommentModel.validateContent(content);

            // Insere a data de atualização no comentário
            commentData.update_date = new Date().toISOString();

            // Verifica se há dados a serem atualizados
            if (!Object.keys(commentData).length) {
                throw new Error('Nenhum dado para atualizar');
            }

            // Filtra os campos que não são undefined e monta os pares coluna = valor
            const filteredUpdates = Object.entries(commentData).filter(([key, value]) => value !== undefined);
            const columns = filteredUpdates.map(([key]) => key);
            const values = filteredUpdates.map(([_, value]) => value);

            // Verifica novamente se há dados válidos para a atualização
            if (!Object.keys(commentData).length || (columns.length < 1 || values.length < 1)) {
                throw new Error('Nenhum dado para atualizar');
            }

            // Realiza a atualização do comentário usando o repositório
            return await CommentRepository.update(columns, values, postId, userId);
        } catch (err) {
            // Lança um erro detalhado caso algo dê errado
            throw new Error(`Erro ao editar o comentário: ${err.message}`);
        }
    }

    /**
     * Obtém todos os comentários relacionados a um post específico
     * @param {Object} commentData Dados necessários para a busca (postId, offset, commentParent)
     * @returns {Array} Lista de comentários encontrados
     */
    static async getAll(commentData) {
        try {
            const { postId, offset, commentParent } = commentData;

            // Busca todos os comentários usando o repositório
            const posts = await CommentRepository.findAll(postId, offset, commentParent);

            // Retorna os comentários encontrados
            return posts;
        } catch (err) {
            // Lança um erro detalhado caso algo dê errado
            throw new Error(`Não foi possivel carregar os comentários: ${err.message}`);
        }
    }
}
