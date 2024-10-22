import pool from "../../db/conn.js";


const TABLE_NAME = 'POST';
const TABLE_VOTE = 'VOTE';
export default class PostRepository{

    static async create(postData){
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const { title, content, user_id: userId, post_picture: postPicture } = postData;

            const query = `INSERT INTO ${TABLE_NAME} 
                            (TITLE, CONTENT, USER_ID, POST_PICTURE) VALUES($1, $2, $3, $4) RETURNING *`;
            const values = [title, content, userId, postPicture];
            const result = await client.query(query, values);
            await client.query('COMMIT');

            const { id } = result.rows[0];

            const selectQuery = `SELECT P.ID, P.TITLE, P.CONTENT, ENCODE(P.POST_PICTURE, 'escape') as POST_PICTURE, P.CREATE_DATE, P.UPDATE_DATE, P.USER_ID
                        FROM ${TABLE_NAME} P
                        INNER JOIN USER_ACCOUNT UA
                        ON UA.ID = P.USER_ID
                        WHERE P.ID = $1`;
            const selectValue = [id];

            const contentCreated = await client.query(selectQuery, selectValue);

            return contentCreated.rows[0];
            
        } catch (err) {
            await client.query('ROLLBACK');
            throw new Error(`Erro ao cadastrar post: ${err.message}`)
        }finally{
            client.release();
        }
    }

    static async remove(id, userId, isAdmin){
        let queryToFindOne;
        let values;
        //Valida se é um admin que está fazendo o delete do post
        if(isAdmin == '1'){
            queryToFindOne = `SELECT ID, TITLE, CONTENT, USER_ID, INACTIVE, 
                UPVOTES, DOWNVOTES, SCORE, COMMENT_COUNT, LAST_ACTIVITY_AT,
                CREATE_DATE, UPDATE_DATE, POST_PICTURE FROM ${TABLE_NAME} WHERE ID = $1`;
            values = [id];
        }else{
            queryToFindOne = `SELECT ID, TITLE, CONTENT, USER_ID, INACTIVE, 
                UPVOTES, DOWNVOTES, SCORE, COMMENT_COUNT, LAST_ACTIVITY_AT, 
                CREATE_DATE, UPDATE_DATE, POST_PICTURE FROM ${TABLE_NAME} WHERE ID = $1 AND USER_ID = $2`;
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
                throw new Error(err.message);
            }finally{
                client.release();
            }
        }else{
            throw new Error('O post não existe!');
        }
    }

    static async update(columns, values, id, userId){
        const client = await pool.connect();
        try {
            const queryToFindOne = `SELECT ID, TITLE, CONTENT FROM ${TABLE_NAME} WHERE ID = $1 AND USER_ID = $2`;
            const valuesToFindOne = [id, userId];

            const findOneResult = await client.query(queryToFindOne, valuesToFindOne);
            const find = findOneResult.rows[0];

            if(find){
                const setQuery = columns.map((col, idx) => `${col} = $${idx + 1}`).join(', ');

                const query = `UPDATE ${TABLE_NAME} SET ${setQuery} WHERE id = $${columns.length + 1} 
                RETURNING ID, TITLE, CONTENT, ENCODE(POST_PICTURE, 'escape') as POST_PICUTRE`;

                const result = await client.query(query, [...values, id]);

                await client.query('COMMIT');

                return result.rows[0];
            }else{
                throw new Error(`O post não existe!`);
            }

        } catch (err) {
            await client.query('ROLLBACK');
            throw new Error(err.message);
        }finally{
            client.release();
        }
    }

    static async up(userId, postId){
        const client = await pool.connect();
        try{
            const queryToVerifyAction = `SELECT * FROM ${TABLE_VOTE} WHERE USER_ID = $1 AND POST_ID = $2`;
            const valuesToVerifyAction = [userId, postId];

            const findAction = await client.query(queryToVerifyAction, valuesToVerifyAction);
            const find = findAction.rows[0];
            if(find && find.type == 1){
                const queryToDelete = `DELETE FROM ${TABLE_VOTE} WHERE USER_ID = $1 AND POST_ID = $2`;
                const valuesToDelete = [userId, postId];
                await client.query(queryToDelete, valuesToDelete);
                await client.query('COMMIT');
            }else if(find && find.type == 2){
                const queryToUpdate = `UPDATE ${TABLE_VOTE} SET TYPE = 1 WHERE USER_ID = $1 AND POST_ID = $2`;
                const valuesToUpdate = [userId, postId];
                await client.query(queryToUpdate, valuesToUpdate);
                await client.query('COMMIT');
            }else{
                const query = `INSERT INTO ${TABLE_VOTE} (POST_ID, USER_ID, TYPE) VALUES($1, $2, $3) RETURNING *`;
                const values = [postId, userId, 1];
                await client.query(query, values);
                await client.query('COMMIT');
            }

        }catch(err){
            await client.query('ROLLBACK');
            throw new Error(err.message);
        }finally{
            client.release();
        }
    }

    static async down(userId, postId){
        const client = await pool.connect();
        try{
            const queryToVerifyAction = `SELECT * FROM ${TABLE_VOTE} WHERE USER_ID = $1 AND POST_ID = $2`;
            const valuesToVerifyAction = [userId, postId];

            const findAction = await client.query(queryToVerifyAction, valuesToVerifyAction);
            const find = findAction.rows[0];
            if(find && find.type == 2){
                const queryToDelete = `DELETE FROM ${TABLE_VOTE} WHERE USER_ID = $1 AND POST_ID = $2`;
                const valuesToDelete = [userId, postId];
                await client.query(queryToDelete, valuesToDelete);
                await client.query('COMMIT');
            }else if(find && find.type == 1){
                const queryToUpdate = `UPDATE ${TABLE_VOTE} SET TYPE = 2 WHERE USER_ID = $1 AND POST_ID = $2`;
                const valuesToUpdate = [userId, postId];
                await client.query(queryToUpdate, valuesToUpdate);
                await client.query('COMMIT');
            }else{
                const query = `INSERT INTO ${TABLE_VOTE} (POST_ID, USER_ID, TYPE) VALUES($1, $2, $3) RETURNING *`;
                const values = [postId, userId, 2];
                await client.query(query, values);
                await client.query('COMMIT');
            }

        }catch(err){
            await client.query('ROLLBACK');
            throw new Error(err.message);
        }finally{
            client.release();
        }
    }

    static async findAll(offset = 0){
        const query = `SELECT P.ID, P.TITLE, P.CONTENT, ENCODE(P.POST_PICTURE, 'escape') as POST_PICTURE, 
                        P.CREATE_DATE, P.UPDATE_DATE, P.UPVOTES, P.DOWNVOTES, LAST_ACTIVITY_AT,
                        UA.NAME AS USERNAME, P.USER_ID,
                        FROM ${TABLE_NAME} P
                        INNER JOIN USER_ACCOUNT UA
                        ON UA.ID = P.USER_ID
                        ORDER BY P.CREATE_DATE DESC
                        LIMIT 10 OFFSET $1`;
        const value = [offset];
        
        const result = await pool.query(query, value);

        return result.rows;

    }
}