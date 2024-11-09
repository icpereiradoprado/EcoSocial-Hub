//Importa o pool de conexão do banco
import pool from "../../db/conn.js";

//Armazena o nome da tabela
const TABLE_NAME = 'EDUCATIONAL_CONTENT';

/**
 * Classe repository para os Conteúdos Educacionais
 */
export default class EducationalContentRepository{
    
    /**
     * 
     * @param {Object} contentData Objeto contendo os valores de um novo Conteúdo Educacional 
     * @returns Retorna um novo Conteúdo Educacional
     */
    static async create(contentData){
        //Armazena uma conexão com o banco de dados, retirado do pool de conexões
        const client = await pool.connect();
        try {
            //Inicia uma transação no banco de dados
            await client.query('BEGIN');
            //Desestrutura os dados do obejto contentData
            const { title, content, tag, userId, content_picture } = contentData;
            //Query de inserção. Obs.: os parâmetros $1, $2, etc. São utilzados para evitar SQL Injection
            const query = `INSERT INTO ${TABLE_NAME} (TITLE, CONTENT, TAG, USER_ID, CONTENT_PICTURE) 
                VALUES($1, $2, $3, $4, $5) RETURNING ID`;
            //Valores que irão substituir os parâmetros indicados por $ na query
            const values = [title, content, tag, userId, content_picture];
            //Armazena o resultado retornado através da query
            const result = await client.query(query, values);
            //Realiza o commit da transação no banco de dados
            await client.query('COMMIT');
            //Armazena o Id do novo registro
            const { id } = result.rows[0];

            //Query para buscar o novo Conteúdo Educacional criado
            const selectQuery = `SELECT EC.ID, EC.TITLE, EC.CONTENT, ENCODE(EC.CONTENT_PICTURE,'escape') as CONTENT_PICTURE, EC.TAG, EC.CREATE_DATE, EC.UPDATE_DATE, UA.NAME AS USERNAME, EC.USER_ID
                        FROM ${TABLE_NAME} EC
                        INNER JOIN USER_ACCOUNT UA
                        ON UA.ID = EC.USER_ID
                        WHERE EC.ID = $1`;
            //Valor que irá substituir o parâmetro indicado por $ na query
            const selectValue = [id];

            //Armazena o resultado retornado através da query 
            const contentCreated = await client.query(selectQuery, selectValue);

            //Retorna o Conteúdo Educacional criado
            return contentCreated.rows[0];
            
        } catch (err) {
            //Caso ocorra algum erro durante a inserção do novo Conteúdo Educacional
            //Realiza um ROLLBACK da transação do banco de dados
            await client.query('ROLLBACK');
            //Dispara uma mensagem de Erro
            throw new Error(`Erro ao cadastrar conteúdo educacional ${err.message}`)
        }finally{
            //Libera a conexão de volta ao pool de conexões, para permitir que a conexão
            //seja reutilizada por outras operações
            client.release();
        }
    }

    /**
     * Método para remover um Conteúdo Educacional
     * @param {number} id Id do Conteúdo Educacional
     */
    static async remove(id){
        //Query para buscar o Conteúdo Educacional à ser removido. 
        //Obs.: os parâmetros $1, $2, etc. São utilzados para evitar SQL Injection
        const queryToFindOne = `SELECT ID, TITLE, CONTENT, CONTENT_PICTURE, 
            TAG, CREATE_DATE, UPDATE_DATE FROM ${TABLE_NAME} WHERE ID = $1`;
        //Valor que irá substituir o parâmetro indicado por $ na query
        const values = [id];
        //Armazena uma conexão com o banco de dados, retirado do pool de conexões
        const client = await pool.connect();
        //Armazena o resultado obito através da query de busca
        const findOneResult = await client.query(queryToFindOne, values);
        const find = findOneResult.rows[0];
        //Verifica se existe valor, se sim, prossegue com a remoção do Conteúdo Educacional
        if(find){
            try{
                //Inicia uma transação no banco de dados
                await client.query('BEGIN');
                //Query para deleção do Conteúdo Educacional
                const query = `DELETE FROM ${TABLE_NAME} WHERE ID = $1`;
                //Valor que irá substituir o parâmetro indicado por $ na query
                const values = [id];
                //Executa a query
                await client.query(query, values);

                //Realiza o commit da transação no banco de dados
                await client.query('COMMIT');

            }catch(err){
                //Caso ocorra algum erro durante a remoção do Conteúdo Educacional
                //Realiza um ROLLBACK da transação do banco de dados
                await client.query('ROLLBACK');
                //Exibe mensagem de erro no console
                console.error('Não foi possível deletar o conteúdo! ', err.message);
            }finally{
                //Libera a conexão de volta ao pool de conexões, para permitir que a conexão
                //seja reutilizada por outras operações
                client.release();
            }
        }else{
            //Dispara um Erro
            throw new Error('O conteúdo não existe!');
        }
    }

    /**
     * Método para buscar os Conteúdos Educacionais paginados
     * @param {*} offset define o número de registro a serem ignorados no início do conjunto de resultados
     * @returns Conteúdos Educacionais Paginados
     */
    static async findAll(offset = 0){
        //Query para buscar os Contúdos Educacionais. Obs.: os parâmetros $1, $2, etc. São utilzados para evitar SQL Injection
        const query = `SELECT EC.ID, EC.TITLE, EC.CONTENT, ENCODE(EC.CONTENT_PICTURE,'escape') as CONTENT_PICTURE, EC.TAG, EC.CREATE_DATE, EC.UPDATE_DATE, UA.NAME AS USERNAME, EC.USER_ID
                        FROM ${TABLE_NAME} EC
                        INNER JOIN USER_ACCOUNT UA
                        ON UA.ID = EC.USER_ID
                        ORDER BY EC.CREATE_DATE DESC
                        LIMIT 10 OFFSET $1`;
        //Valor que irá substituir o parâmetro indicado por $ na query
        const value = [offset];
        
        //Armazena o resultado obtido através da query
        const result = await pool.query(query, value);

        //Retonra os Conteúdos Educacionais paginados
        return result.rows;

    }

    /**
     * Método que atualiza o Conteúdo Educacional
     * @param {Array} columns Colunas a serem alteradas
     * @param {Array} values Valores ataulizados
     * @param {number} contentId Id do conteúdo
     * @param {number} userId Id do usuário
     * @returns Retorna o Conteúdo Educacional Atualizado
     */
    static async update(columns, values, contentId, userId){
        //Armazena uma conexão com o banco de dados, retirado do pool de conexões
        const client = await pool.connect();
        try {
            //Query para busca o conteúdo à ser atualizado. 
            //Obs.: os parâmetros $1, $2, etc. São utilzados para evitar SQL Injection
            const queryToFindOne = `SELECT ID, TITLE, CONTENT, CONTENT_PICTURE, TAG, CREATE_DATE, 
                UPDATE_DATE FROM ${TABLE_NAME} WHERE ID = $1 AND USER_ID = $2`;
            //Valores que irão substituir os parâmetros indicados por $ na query
            const valuesToFindOne = [contentId, userId];

            //Armazena o resultado obtido através da query
            const findOneResult = await client.query(queryToFindOne, valuesToFindOne);
            const find = findOneResult.rows[0];
            //Verifica se existe valor, se sim, prossegue com a edição do comentário
            if(find){
                //Cria a query de acordo com as colunas que seão editas
                //Isso permite que a query de edição seja flexível
                const setQuery = columns.map((col, idx) => `${col} = $${idx + 1}`).join(', ');
                //Query para atualizar o Conteúdo Educacional
                const query = `UPDATE ${TABLE_NAME} SET ${setQuery} WHERE id = $${columns.length + 1} 
                    RETURNING ID, TITLE, CONTENT, TAG, ENCODE(CONTENT_PICTURE,'escape') as CONTENT_PICTURE, CREATE_DATE, UPDATE_DATE`;

                //Armazena o resultado da obtido através da query de atualização
                const result = await client.query(query, [...values, contentId]);

                //Realiza o commit da transação no banco de dados
                await client.query('COMMIT');

                //Query para buscar o Conteúdo Educacional atualizado
                const selectQuery = `SELECT EC.ID, EC.TITLE, EC.CONTENT, ENCODE(EC.CONTENT_PICTURE,'escape') as CONTENT_PICTURE, EC.TAG, EC.CREATE_DATE, EC.UPDATE_DATE, UA.NAME AS USERNAME, EC.USER_ID
                        FROM ${TABLE_NAME} EC
                        INNER JOIN USER_ACCOUNT UA
                        ON UA.ID = EC.USER_ID
                        WHERE EC.ID = $1`;
                //Valor que irá substituir o parâmetro indicado por $ na query
                const selectValue = [result.rows[0].id];

                //Armazena o Conteúdo Educacional atualizado
                const contentUpdated = await client.query(selectQuery, selectValue);

                //Retorna o Conteúdo Educacional atualizado
                return contentUpdated.rows[0];

            }else{
                //Dispara um mensagem de Erro
                throw new Error(`O conteúdo não existe ou você não tem permissão para editá-lo!`);
            }

        } catch (err) {
            //Caso ocorra algum erro durante a atualização do Conteúdo Educacional
            //Realiza um ROLLBACK da transação do banco de dados
            await client.query('ROLLBACK');
            //Dispara um mensagem de Erro
            throw new Error(err.message);
        }finally{
            //Libera a conexão de volta ao pool de conexões, para permitir que a conexão
            //seja reutilizada por outras operações
            client.release();
        }
    }

}