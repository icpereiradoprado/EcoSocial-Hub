import pool from "../../db/conn.js";

const TABLE_NAME = 'COMMENT';

export default class CommentRepository{

    static async create(postData){
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const { post_id: postId, content, user_id: userId, comment_parent: commentParent } = postData;

            const query = `INSERT INTO ${TABLE_NAME} 
                            (CONTENT, USER_ID, POST_ID, COMMENT_PARENT) VALUES($1, $2, $3, $4) RETURNING *`;
            const values = [content, userId, postId, commentParent];
            const result = await client.query(query, values);
            await client.query('COMMIT');

            const { id } = result.rows[0];

            const selectQuery = `SELECT C.ID, C.CONTENT, C.CREATE_DATE, C.UPDATE_DATE, C.USER_ID, UA.NAME AS USERNAME
                        FROM ${TABLE_NAME} C
                        INNER JOIN USER_ACCOUNT UA
                        ON UA.ID = C.USER_ID
                        WHERE C.ID = $1`;
            const selectValue = [id];

            const contentCreated = await client.query(selectQuery, selectValue);

            return contentCreated.rows[0];
            
        } catch (err) {
            await client.query('ROLLBACK');
            throw new Error(`Erro ao cadastrar comentário: ${err.message}`)
        }finally{
            client.release();
        }
    }

    static async remove(id, userId, isAdmin){
        let queryToFindOne;
        let values;
        //Valida se é um admin que está fazendo o delete do comentário
        if(isAdmin == '1'){
            queryToFindOne = `SELECT ID, CONTENT, POST_ID, USER_ID,
            CREATE_DATE, UPDATE_DATE FROM ${TABLE_NAME} WHERE ID = $1`;
            values = [id];
        }else{
            queryToFindOne = `SELECT ID, CONTENT, POST_ID, USER_ID, 
                UPVOTES, DOWNVOTES, SCORE, COMMENT_COUNT, LAST_ACTIVITY_AT, 
                CREATE_DATE, UPDATE_DATE FROM ${TABLE_NAME} WHERE ID = $1 AND USER_ID = $2`;
            values = [id, userId];
        }
        
        const client = await pool.connect();

        const findOneResult = await client.query(queryToFindOne, values);
        const find = findOneResult.rows[0];

        if(find){
            try{
                await client.query('BEGIN');
                const query = `DELETE FROM ${TABLE_NAME} WHERE ID = $1`;
                const values = [id];
                await client.query(query, values);

                await client.query('COMMIT');

            }catch(err){
                await client.query('ROLLBACK');
                throw new Error('Não foi possível deletar o comentário! ', err.message);
            }finally{
                client.release();
            }
        }else{
            throw new Error('O comentário não existe!');
        }
    }

    static async update(columns, values, id, userId){
        const client = await pool.connect();
        try {
            const queryToFindOne = `SELECT ID, CONTENT FROM ${TABLE_NAME} WHERE ID = $1 AND USER_ID = $2`;
            const valuesToFindOne = [id, userId];

            const findOneResult = await client.query(queryToFindOne, valuesToFindOne);
            const find = findOneResult.rows[0];

            if(find){
                const setQuery = columns.map((col, idx) => `${col} = $${idx + 1}`).join(', ');

                const query = `UPDATE ${TABLE_NAME} SET ${setQuery} WHERE id = $${columns.length + 1} RETURNING *`;

                const result = await client.query(query, [...values, id]);

                await client.query('COMMIT');

                return result.rows[0];
            }else{
                throw new Error(`O comentário não existe!`);
            }

        } catch (err) {
            await client.query('ROLLBACK');
            throw new Error(err.message);
        }finally{
            client.release();
        }
    }

    static async findAll(postId, offset = 0, commentParent = 0){
        const query = `SELECT C.ID, C.CONTENT, C.POST_ID, C.USER_ID, C.CREATE_DATE, C.UPDATE_DATE, C.COMMENT_PARENT, UA.NAME AS USERNAME
                        FROM ${TABLE_NAME} C
                        INNER JOIN USER_ACCOUNT UA
                        ON UA.ID = C.USER_ID
                        WHERE C.POST_ID = $1 AND (CASE WHEN $3 = 0 THEN C.COMMENT_PARENT IS NULL ELSE C.COMMENT_PARENT = $3 END)
                        ORDER BY C.CREATE_DATE DESC
                        LIMIT 10 OFFSET $2`;
        const values = [postId, offset, commentParent];
        const result = await pool.query(query, values);

        return result.rows;

    }
}