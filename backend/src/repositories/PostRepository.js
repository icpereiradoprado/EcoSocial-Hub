//Importa o pool de conexão do banco
import pool from "../../db/conn.js";

//Armazena o nome da tabela POST
const TABLE_NAME = 'POST';
//Armazena o nome da tabela VOTE
const TABLE_VOTE = 'VOTE';

/**
 * Classe repository para os POSTS
 */
export default class PostRepository{

    /**
     * Método para criar um novo Post
     * @param {Object} postData Objeto contendo os valores de um novo Post
     * @returns novo Post
     */
    static async create(postData){
        //Armazena uma conexão com o banco de dados, retirado do pool de conexões
        const client = await pool.connect();
        try {
            //Inicia uma transação no banco de dados
            await client.query('BEGIN');
            //Desestrutura os dados do obejto postData
            const { title, content, user_id: userId, post_picture: postPicture } = postData;
            
            //Query de inserção. Obs.: os parâmetros $1, $2, etc. São utilzados para evitar SQL Injection
            const query = `INSERT INTO ${TABLE_NAME} 
                            (TITLE, CONTENT, USER_ID, POST_PICTURE) VALUES($1, $2, $3, $4) RETURNING *`;
            //Valores que irão substituir os parâmetros indicados por $ na query
            const values = [title, content, userId, postPicture];
            //Armazena o resultado retornado através da query
            const result = await client.query(query, values);
            //Realiza o commit da transação no banco de dados
            await client.query('COMMIT');

            //Armazena o Id do registro criado
            const { id } = result.rows[0];

            //Query para buscar o novo Post criado
            const selectQuery = `SELECT P.ID, P.TITLE, P.CONTENT, 
                        ENCODE(P.POST_PICTURE, 'escape') as POST_PICTURE, P.CREATE_DATE, 
                        P.UPDATE_DATE, P.USER_ID, UA.NAME AS USERNAME, UA.CITY
                        FROM ${TABLE_NAME} P
                        INNER JOIN USER_ACCOUNT UA
                        ON UA.ID = P.USER_ID
                        WHERE P.ID = $1`;
            //Valor que irá substituir o parâmetro indicado por $ na query
            const selectValue = [id];

            //Armazena o novo Post criado
            const contentCreated = await client.query(selectQuery, selectValue);

            //Retorna o novo Post criado
            return contentCreated.rows[0];
            
        } catch (err) {
            //Caso ocorra algum erro durante a inserção do novo Post
            //Realiza um ROLLBACK da transação do banco de dados
            await client.query('ROLLBACK');
            //Dispara mensagem de erro
            throw new Error(`Erro ao cadastrar post: ${err.message}`)
        }finally{
            //Libera a conexão de volta ao pool de conexões, para permitir que a conexão
            //seja reutilizada por outras operações
            client.release();
        }
    }

    /**
     * Método para remover um Post cadastrado
     * @param {number} id Id do Post
     * @param {number} userId Id do usuário
     * @param {number} isAdmin indica se o usuário é um administrador
     */
    static async remove(id, userId, isAdmin){
        let queryToFindOne;
        let values;
        //Valida se é um admin que está fazendo o delete do post
        if(isAdmin == '1'){
            queryToFindOne = `SELECT ID, TITLE, CONTENT, USER_ID, INACTIVE, 
                UPVOTES, DOWNVOTES, SCORE, COMMENT_COUNT, LAST_ACTIVITY_AT,
                CREATE_DATE, UPDATE_DATE, POST_PICTURE FROM ${TABLE_NAME} WHERE ID = $1`;
            values = [id];
        }else{//Se não for um admin valida se é o próprio dono do Post
            queryToFindOne = `SELECT ID, TITLE, CONTENT, USER_ID, INACTIVE, 
                UPVOTES, DOWNVOTES, SCORE, COMMENT_COUNT, LAST_ACTIVITY_AT, 
                CREATE_DATE, UPDATE_DATE, POST_PICTURE FROM ${TABLE_NAME} WHERE ID = $1 AND USER_ID = $2`;
            values = [id, userId];
        }
        
        //Armazena uma conexão com o banco de dados, retirado do pool de conexões
        const client = await pool.connect();

        //Armazena o resultado da query que traz o Post
        const findOneResult = await client.query(queryToFindOne, values);
        const find = findOneResult.rows[0];

        //Verifica se existe valor, se sim, prossegue com a edição do Post
        if(find){
            try{
                //Inicia uma transação no banco de dados
                await client.query('BEGIN');
                //Query para remover o Post
                const query = `DELETE FROM ${TABLE_NAME} WHERE ID = $1`;
                //Valor que irá substituir o parâmetro indicado por $ na query
                const values = [id];
                //Executa a query de remoção
                await client.query(query, values);
                //Realiza o commit da transação no banco de dados
                await client.query('COMMIT');

            }catch(err){
                //Caso ocorra algum erro durante a remoção do Post
                //Realiza um ROLLBACK da transação do banco de dados
                await client.query('ROLLBACK');
                //Dispara uma mensagem de Erro
                throw new Error(err.message);
            }finally{
                //Libera a conexão de volta ao pool de conexões, para permitir que a conexão
                //seja reutilizada por outras operações
                client.release();
            }
        }else{
            //Dispara uma mensagem de Erro
            throw new Error('O post não existe!');
        }
    }

    /**
     * 
     * @param {Array} columns Colunas a serem alteradas 
     * @param {Array} values Valores alterados
     * @param {number} id Id do Post
     * @param {number} userId Id do usuário
     * @returns Post atualizado
     */
    static async update(columns, values, id, userId){
        //Armazena uma conexão com o banco de dados, retirado do pool de conexões
        const client = await pool.connect();
        try {
            //Query de buscar o Post que será editado. 
            //Obs.: os parâmetros $1, $2, etc. São utilzados para evitar SQL Injection
            const queryToFindOne = `SELECT ID, TITLE, CONTENT FROM ${TABLE_NAME} WHERE ID = $1 AND USER_ID = $2`;
            //Valores que irão substituir os parâmetros indicados por $ na query
            const valuesToFindOne = [id, userId];

            //Armazena o resultado da query que traz o comentário
            const findOneResult = await client.query(queryToFindOne, valuesToFindOne);
            const find = findOneResult.rows[0];
            //Verifica se existe valor, se sim, prossegue com a edição do comentário
            if(find){
                //Cria a query de acordo com as colunas que seão editas
                //Isso permite que a query de edição seja flexível
                const setQuery = columns.map((col, idx) => `${col} = $${idx + 1}`).join(', ');

                //Query para atualizar o Post
                const query = `UPDATE ${TABLE_NAME} SET ${setQuery} WHERE id = $${columns.length + 1} 
                RETURNING ID, TITLE, CONTENT, ENCODE(POST_PICTURE, 'escape') as POST_PICUTRE, CREATE_DATE`;

                //Armazena o Post atualizado
                const result = await client.query(query, [...values, id]);
                
                //Realiza o commit da transação no banco de dados
                await client.query('COMMIT');
                //Query para buscar o Post atualizado
                const selectQuery = `SELECT P.ID, P.TITLE, P.CONTENT, ENCODE(P.POST_PICTURE,'escape') as POST_PICTURE, 
                        P.CREATE_DATE, UA.NAME AS USERNAME, P.USER_ID, UA.CITY
                        FROM ${TABLE_NAME} P
                        INNER JOIN USER_ACCOUNT UA
                        ON UA.ID = P.USER_ID
                        WHERE P.ID = $1`;
                //Valor que irá substituir o parâmetro indicado por $ na query
                const selectValue = [result.rows[0].id];
                //Armazena o valor do Post atualizado
                const postUpdated = await client.query(selectQuery, selectValue);

                //Retorna o Post atualizado
                return postUpdated.rows[0];
            }else{
                //Dispara uma mensagem de Erro
                throw new Error(`O post não existe!`);
            }

        } catch (err) {
            //Caso ocorra algum erro durante a atualização do Post
            //Realiza um ROLLBACK da transação do banco de dados
            await client.query('ROLLBACK');
            //Dispara uma mensagem de erro
            throw new Error(err.message);
        }finally{
            //Libera a conexão de volta ao pool de conexões, para permitir que a conexão
            //seja reutilizada por outras operações
            client.release();
        }
    }

    /**
     * Método para setar um Up Vote (like|gostei) em um determinado Post
     * @param {number} userId Id do usuário
     * @param {number} postId Id do Post
     */
    static async up(userId, postId){
        //Armazena uma conexão com o banco de dados, retirado do pool de conexões
        const client = await pool.connect();
        try{
            //Query para buscar o post que irá receber o voto. 
            //Obs.: os parâmetros $1, $2, etc. São utilzados para evitar SQL Injection
            const queryToVerifyAction = `SELECT * FROM ${TABLE_VOTE} WHERE USER_ID = $1 AND POST_ID = $2`;
            //Valores que irão substituir os parâmetros indicados por $ na query
            const valuesToVerifyAction = [userId, postId];

            //Armazena o valor da query de busca
            const findAction = await client.query(queryToVerifyAction, valuesToVerifyAction);
            const find = findAction.rows[0];
            //Verifica se existe valor, se sim, prossegue com a ação de voto para o Post
            //E caso o tipo da ação for igual a 1 quer dizer que o usuário está removendo o like do Post
            if(find && find.type == 1){
                //Query para deletar o like do Post
                const queryToDelete = `DELETE FROM ${TABLE_VOTE} WHERE USER_ID = $1 AND POST_ID = $2`;
                //Valores que irão substituir os parâmetros indicados por $ na query
                const valuesToDelete = [userId, postId];
                //Executa a query de deleção
                await client.query(queryToDelete, valuesToDelete);
                //Realiza o commit da transação no banco de dados
                await client.query('COMMIT');
            }else if(find && find.type == 2){//Caso o tipo for igual a 2 quer dizer que o usuário está trocando de like para dislike
                //Query para atualizar o voto do Post
                const queryToUpdate = `UPDATE ${TABLE_VOTE} SET TYPE = 1 WHERE USER_ID = $1 AND POST_ID = $2`;
                //Valores que irão substituir os parâmetros indicados por $ na query
                const valuesToUpdate = [userId, postId];
                //Executa a query de atualização
                await client.query(queryToUpdate, valuesToUpdate);
                //Realiza o commit da transação no banco de dados
                await client.query('COMMIT');
            }else{//Caso contrário, ele está inserindo um like ao Post
                //Query para inserir um like no Post
                const query = `INSERT INTO ${TABLE_VOTE} (POST_ID, USER_ID, TYPE) VALUES($1, $2, $3) RETURNING *`;
                //Valores que irão substituir os parâmetros indicados por $ na query
                const values = [postId, userId, 1];
                //Executa a query de inserção
                await client.query(query, values);
                //Realiza o commit da transação no banco de dados
                await client.query('COMMIT');
            }

        }catch(err){
            //Caso ocorra algum erro durante a ação de voto do Post
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
     * Método para setar um Down Vote (dislike|não gostei) em um determinado Post
     * @param {number} userId Id do usuário
     * @param {number} postId Id do Post
     */
    static async down(userId, postId){
        const client = await pool.connect();
        try{
            //Query para buscar o post que irá receber o voto. 
            //Obs.: os parâmetros $1, $2, etc. São utilzados para evitar SQL Injection
            const queryToVerifyAction = `SELECT * FROM ${TABLE_VOTE} WHERE USER_ID = $1 AND POST_ID = $2`;
            const valuesToVerifyAction = [userId, postId];
            //Armazena o valor da query de busca
            const findAction = await client.query(queryToVerifyAction, valuesToVerifyAction);
            const find = findAction.rows[0];
            //Verifica se existe valor, se sim, prossegue com a ação de voto para o Post
            //E caso o tipo da ação for igual a 2 quer dizer que o usuário está removendo o dislike do Post
            if(find && find.type == 2){
                //Query para deletar o dislike do Post
                const queryToDelete = `DELETE FROM ${TABLE_VOTE} WHERE USER_ID = $1 AND POST_ID = $2`;
                //Valores que irão substituir os parâmetros indicados por $ na query
                const valuesToDelete = [userId, postId];
                //Executa a query de deleção
                await client.query(queryToDelete, valuesToDelete);
                //Realiza o commit da transação no banco de dados
                await client.query('COMMIT');
            }else if(find && find.type == 1){
                //Query para atualizar o voto do Post
                const queryToUpdate = `UPDATE ${TABLE_VOTE} SET TYPE = 2 WHERE USER_ID = $1 AND POST_ID = $2`;
                //Valores que irão substituir os parâmetros indicados por $ na query
                const valuesToUpdate = [userId, postId];
                //Executa a query de atualização
                await client.query(queryToUpdate, valuesToUpdate);
                //Realiza o commit da transação no banco de dados
                await client.query('COMMIT');
            }else{
                //Query para inserir o dislike no Post
                const query = `INSERT INTO ${TABLE_VOTE} (POST_ID, USER_ID, TYPE) VALUES($1, $2, $3) RETURNING *`;
                //Valores que irão substituir os parâmetros indicados por $ na query
                const values = [postId, userId, 2];
                //Executa a query de inserção
                await client.query(query, values);
                //Realiza o commit da transação no banco de dados
                await client.query('COMMIT');
            }

        }catch(err){
            //Caso ocorra algum erro durante a ação de voto do Post
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
     * Método para trazer os Posts paginados
     * @param {number} offset define o número de registro a serem ignorados no início do conjunto de resultados
     * @returns Posts paginados
     */
    static async findAll(offset = 0){
        //Query para trazer os posts paginados. 
        //Obs.: os parâmetros $1, $2, etc. São utilzados para evitar SQL Injection
        const query = `SELECT P.ID, P.TITLE, P.CONTENT, ENCODE(P.POST_PICTURE, 'escape') as POST_PICTURE, 
                        P.CREATE_DATE, P.UPDATE_DATE, P.UPVOTES, P.DOWNVOTES, LAST_ACTIVITY_AT,
                        UA.NAME AS USERNAME, UA.CITY, P.USER_ID, P.COMMENT_COUNT
                        FROM ${TABLE_NAME} P
                        INNER JOIN USER_ACCOUNT UA
                        ON UA.ID = P.USER_ID
                        ORDER BY P.CREATE_DATE DESC
                        LIMIT 10 OFFSET $1`;
        //Valor que irá substituir o parâmetro indicado por $ na query
        const value = [offset];
        
        //Armazena os resultado obtidos através da query
        const result = await pool.query(query, value);

        //Retorna os Posts paginados
        return result.rows;

    }

    /**
     * Método que busca todos os posts votado por um determinado usuário
     * @param {number} userId Id do usuário
     * @param {number} postId Id do Post
     * @returns Posts votado por um determinado usuário
     */
    static async postsVoted(userId, postId){
        //Query para buscar os Posts votados pelo usuário.
        //Obs.: os parâmetros $1, $2, etc. São utilzados para evitar SQL Injection
        const query = `SELECT * FROM ${TABLE_VOTE} WHERE USER_ID = $1 AND POST_ID = $2`;
        //Valores que irão substituir os parâmetros indicados por $ na query
        const value = [userId, postId];
        //Armazena os resultados obitidos através da query
        const result = await pool.query(query, value);

        //Retorna os posts votados por um determinado usuário
        return result.rows;
    }
}