//Importa o pool de conexão do banco
import pool from "../../db/conn.js";

//Armazena o nome da tabela
const TABLE_NAME = 'COMMENT';

/**
 * Classe repository para os Comentários
 */
export default class CommentRepository{

    /**
     * Método que insere um novo post no banco de dados
     * @param {Object} postData Objeto contendo os valores de um novo comentário
     * @returns novo cometário
     */
    static async create(postData){
        //Armazena uma conexão com o banco de dados, retirado do pool de conexões
        const client = await pool.connect();
        try {
            //Inicia uma transação no banco de dados
            await client.query('BEGIN');
            //Desestrutra os dados do objeto postData
            const { post_id: postId, content, user_id: userId, comment_parent: commentParent } = postData;

            //Query de inserção. Obs.: os parâmetros $1, $2, etc. São utilzados para evitar SQL Injection
            const query = `INSERT INTO ${TABLE_NAME} 
                            (CONTENT, USER_ID, POST_ID, COMMENT_PARENT) VALUES($1, $2, $3, $4) RETURNING *`;
            //Valores que irão substituir os parâmetros indicados por $ na query
            const values = [content, userId, postId, commentParent];
            //Armazena o resultado retornado através da query
            const result = await client.query(query, values);
            //Realiza o commit da transação no banco de dados
            await client.query('COMMIT');

            //Obtém o id do registro inserido
            const { id } = result.rows[0];

            //Query para buscar os dados do registro inserido
            const selectQuery = `SELECT C.ID, C.CONTENT, C.CREATE_DATE, C.UPDATE_DATE, C.USER_ID, UA.NAME AS USERNAME
                        FROM ${TABLE_NAME} C
                        INNER JOIN USER_ACCOUNT UA
                        ON UA.ID = C.USER_ID
                        WHERE C.ID = $1`;
            //Valor que ira substituir o parâmetro indicado por $ na query
            const selectValue = [id];

            //Armazena o resultado retornado através da query
            const contentCreated = await client.query(selectQuery, selectValue);

            //Retorna o novo comentário criado
            return contentCreated.rows[0];
            
        } catch (err) {
            //Caso ocorra algum erro durante a inserção do novo comentário
            //Realiza um ROLLBACK da transação do banco de dados
            await client.query('ROLLBACK');
            //Dispara uma mensagem de Erro
            throw new Error(`Erro ao cadastrar comentário: ${err.message}`)
        }finally{
            //Libera a conexão de volta ao pool de conexões, para permitir que a conexão
            //seja reutilizada por outras operações
            client.release();
        }
    }

    /**
     * Método que remove um comentário do banco de dados
     * @param {number | string} id Id do comentário
     * @param {number | string} userId Id do usuário
     * @param {number | string} isAdmin indica se o usuário é um administrador
     */
    static async remove(id, userId, isAdmin){
        let queryToFindOne;
        let values;
        //Valida se é um admin que está fazendo o delete do comentário
        if(isAdmin == '1'){
            queryToFindOne = `SELECT ID, CONTENT, POST_ID, USER_ID,
            CREATE_DATE, UPDATE_DATE FROM ${TABLE_NAME} WHERE ID = $1`;
            values = [id];
        }else{//Se não for um admin valida se é o próprio dono do comentário
            queryToFindOne = `SELECT ID, CONTENT, POST_ID, USER_ID, 
                UPVOTES, DOWNVOTES, SCORE, COMMENT_COUNT, LAST_ACTIVITY_AT, 
                CREATE_DATE, UPDATE_DATE FROM ${TABLE_NAME} WHERE ID = $1 AND USER_ID = $2`;
            values = [id, userId];
        }
        //Armazena uma conexão com o banco de dados, retirado do pool de conexões
        const client = await pool.connect();
        //Armazena o resultado da query que traz o comentário
        const findOneResult = await client.query(queryToFindOne, values);
        const find = findOneResult.rows[0];
        //Verifica se existe valor, se sim, prossegue com a remoção do comentário
        if(find){
            try{
                //Inicia uma transação no banco de dados
                await client.query('BEGIN');
                //Query para remover um comentário
                const query = `DELETE FROM ${TABLE_NAME} WHERE ID = $1`;
                //Valor que ira substituir o parâmetro indicado por $ na query
                const values = [id];
                //Executa a query de remoção
                await client.query(query, values);
                //Realiza o commit da transação no banco de dados
                await client.query('COMMIT');

            }catch(err){
                //Caso ocorra algum erro durante a romoção do comentário
                //Realiza um ROLLBACK da transação do banco de dados
                await client.query('ROLLBACK');
                //Dispara uma mensagem de Erro
                throw new Error('Não foi possível deletar o comentário! ', err.message);
            }finally{
                client.release();
            }
        }else{
            //Libera a conexão de volta ao pool de conexões, para permitir que a conexão
            //seja reutilizada por outras operações
            throw new Error('O comentário não existe!');
        }
    }

    /**
     * Método que atualiza um comentário do banco de dados
     * @param {Array} columns colunas a serem alteradas
     * @param {Array} values valores atualizados
     * @param {number} id id do comentário
     * @param {number | string} userId id do usuário
     * @returns comentário editado
     */
    static async update(columns, values, id, userId){
        //Armazena uma conexão com o banco de dados, retirado do pool de conexões
        const client = await pool.connect();
        try {
            //Query para buscar o comentário a ser editado. Obs.: os parâmetros $1, $2, etc. São utilzados para evitar SQL Injection
            const queryToFindOne = `SELECT ID, CONTENT FROM ${TABLE_NAME} WHERE ID = $1 AND USER_ID = $2`;
            //Valores que irão substituir os parâmetros indicados por $ na query
            const valuesToFindOne = [id, userId];
            //Armazena o resultado da query
            const findOneResult = await client.query(queryToFindOne, valuesToFindOne);
            const find = findOneResult.rows[0];

            //Verifica se existe valor, se sim, prossegue com a edição do comentário
            if(find){
                //Cria a query de acordo com as colunas que seão editas
                //Isso permite que a query de edição seja flexível
                const setQuery = columns.map((col, idx) => `${col} = $${idx + 1}`).join(', ');

                //Query para atualizar o comentário
                const query = `UPDATE ${TABLE_NAME} SET ${setQuery} WHERE id = $${columns.length + 1} RETURNING *`;

                //Armazena o resultado obtido através da query de atualização
                const result = await client.query(query, [...values, id]);

                //Realiza o commit da transação no banco de dados
                await client.query('COMMIT');

                //Retorna o comentário atualizado
                return result.rows[0];
            }else{
                //Dispara uma mensagem de Erro
                throw new Error(`O comentário não existe!`);
            }

        } catch (err) {
            //Caso ocorra algum erro durante a edição do comentário
            //Realiza um ROLLBACK da transação do banco de dados
            await client.query('ROLLBACK');
            //Dispara uma mensagem de Erro
            throw new Error(err.message);
        }finally{
            //Libera a conexão de volta ao pool de conexões, para permitir que a conexão
            //seja reutilizada por outras operações
            client.release();
        }
    }

    /**
     * Método que busca todos os cometários de um determinado Post
     * @param {number} postId 
     * @param {number} offset 
     * @param {number} commentParent 
     * @returns Todos os comentários de um post
     */
    static async findAll(postId, offset = 0, commentParent = 0){
        //Query para buscar os cometários. Obs.: os parâmetros $1, $2, etc. São utilzados para evitar SQL Injection
        const query = `SELECT C.ID, C.CONTENT, C.POST_ID, C.USER_ID, C.CREATE_DATE, C.UPDATE_DATE, C.COMMENT_PARENT, UA.NAME AS USERNAME
                        FROM ${TABLE_NAME} C
                        INNER JOIN USER_ACCOUNT UA
                        ON UA.ID = C.USER_ID
                        WHERE C.POST_ID = $1 AND (CASE WHEN $3 = 0 THEN C.COMMENT_PARENT IS NULL ELSE C.COMMENT_PARENT = $3 END)
                        ORDER BY C.CREATE_DATE DESC
                        LIMIT 10 OFFSET $2`;
        //Valores que irão substituir os parâmetros indicados por $ na query
        const values = [postId, offset, commentParent];

        //Armazena o resultado retornado através da query
        const result = await pool.query(query, values);

        //Retorna todos os comentários de um determinado post
        return result.rows;

    }
}