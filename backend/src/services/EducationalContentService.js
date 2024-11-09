// Importa o repositório de conteúdo educacional para interagir com a camada de dados (banco de dados)
import EducationalContentRepository from "../repositories/EducationalContentRepository.js";

// Importa o modelo de conteúdo educacional para validação e estruturação dos dados
import EducationalContentModel from "../models/EducationalContentModel.js";

// Classe de serviço para gerenciar operações relacionadas a conteúdos educacionais
export default class EducationalContentService {

    /**
     * Registra um novo conteúdo educacional
     * @param {Object} contentData Dados do conteúdo passado pela requisição
     * @returns {Object} Retorna o conteúdo criado
     */
    static async register(contentData) {
        try {
            // Valida o título e o conteúdo do objeto
            EducationalContentModel.validateTitle(contentData.title);
            EducationalContentModel.validateContent(contentData.content);

            // Verifica e valida as tags se elas existirem
            if (contentData.tag && Array.isArray(contentData.tag)) {
                const tags = contentData.tag;
                tags.forEach((tag) => {
                    EducationalContentModel.validateTag(tag);
                });
                // Junta as tags em uma string separada por ponto e vírgula
                contentData.tag = tags.join(';');
            }

            // Cria o conteúdo no repositório
            const content = await EducationalContentRepository.create(contentData);

            // Retorna o conteúdo criado
            return content;

        } catch (err) {
            // Lança um erro detalhado caso algo dê errado
            throw new Error(`Não foi possível registrar o conteúdo: ${err.message}`);
        }
    }

    /**
     * Deleta um conteúdo educacional específico
     * @param {Object} contentData Dados do conteúdo contendo o 'id'
     */
    static async delete(contentData) {
        try {
            const { id } = contentData;

            // Verifica se o 'id' do conteúdo é válido
            if (!id || id < 0) {
                throw new Error("ID do conteúdo inválido");
            }

            // Remove o conteúdo usando o repositório
            await EducationalContentRepository.remove(id);
        } catch (err) {
            // Lança um erro detalhado caso algo dê errado
            throw new Error(`Não foi possível deletar o conteúdo: ${err.message}`);
        }
    }

    /**
     * Obtém todos os conteúdos educacionais com base em um offset
     * @param {Object} contentData Dados necessários para a busca (offset)
     * @returns {Array} Lista de conteúdos encontrados
     */
    static async getAll(contentData) {
        try {
            const { offset } = contentData;

            // Busca todos os conteúdos usando o repositório
            const contents = await EducationalContentRepository.findAll(offset);

            // Retorna os conteúdos encontrados
            return contents;

        } catch (err) {
            // Lança um erro detalhado caso algo dê errado
            throw new Error(`Não foi possível carregar os conteúdos: ${err.message}`);
        }
    }

    /**
     * Edita um conteúdo educacional existente
     * @param {Object} contentData Dados do conteúdo a serem atualizados
     * @param {number} contentId ID do conteúdo a ser editado
     * @param {number} userId ID do usuário que está solicitando a edição
     * @returns {Object} Resultado da atualização do conteúdo
     */
    static async edit(contentData, contentId, userId) {
        try {
            const { title, content, tag } = contentData;

            // Valida o título e o conteúdo
            EducationalContentModel.validateTitle(title);
            EducationalContentModel.validateContent(content);

            // Verifica e valida as tags se elas existirem
            if (tag && Array.isArray(tag)) {
                const tags = contentData.tag;
                tags.forEach((tag) => {
                    EducationalContentModel.validateTag(tag);
                });
                // Junta as tags em uma string separada por ponto e vírgula
                contentData.tag = tags.join(';');
            }

            // Verifica se há dados para atualizar
            if (!Object.keys(contentData).length) {
                throw new Error('Nenhum dado para atualizar');
            }

            // Filtra os campos que não são undefined e monta os pares coluna = valor
            const filteredUpdates = Object.entries(contentData).filter(([key, value]) => value !== undefined);
            const columns = filteredUpdates.map(([key]) => key);
            const values = filteredUpdates.map(([_, value]) => value);

            // Verifica novamente se há dados válidos para atualização
            if (!Object.keys(contentData).length || (columns.length < 1 || values.length < 1)) {
                throw new Error('Nenhum dado para atualizar');
            } else {
                // Caso exista algum valor, atualiza a coluna `update_date`
                contentData.update_date = new Date().toISOString();
            }

            // Realiza a atualização do conteúdo usando o repositório
            return await EducationalContentRepository.update(columns, values, contentId, userId);
        } catch (err) {
            // Lança um erro detalhado caso algo dê errado
            throw new Error(`Erro ao editar o conteúdo: ${err.message}`);
        }
    }
}
