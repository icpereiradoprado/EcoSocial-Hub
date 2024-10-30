import pool from "../../db/conn.js";

const TABLE_NAME = 'EDUCATIONAL_CONTENT';

export default class EducationalContentRepository{

    static async create(contentData){
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const { title, content, tag, userId, content_picture } = contentData;
            const query = `INSERT INTO ${TABLE_NAME} (TITLE, CONTENT, TAG, USER_ID, CONTENT_PICTURE) VALUES($1, $2, $3, $4, $5) RETURNING ID`;
            const values = [title, content, tag, userId, content_picture];
            const result = await client.query(query, values);
            await client.query('COMMIT');
            
            const { id } = result.rows[0];

            const selectQuery = `SELECT EC.ID, EC.TITLE, EC.CONTENT, ENCODE(EC.CONTENT_PICTURE,'escape') as CONTENT_PICTURE, EC.TAG, EC.CREATE_DATE, EC.UPDATE_DATE, UA.NAME AS USERNAME, EC.USER_ID
                        FROM ${TABLE_NAME} EC
                        INNER JOIN USER_ACCOUNT UA
                        ON UA.ID = EC.USER_ID
                        WHERE EC.ID = $1`;
            const selectValue = [id];

            const contentCreated = await client.query(selectQuery, selectValue);

            return contentCreated.rows[0];
            
        } catch (err) {
            await client.query('ROLLBACK');
            throw new Error(`Erro ao cadastrar conteúdo educacional ${err.message}`)
        }finally{
            client.release();
        }
    }

    static async remove(id){
        const queryToFindOne = `SELECT ID, TITLE, CONTENT, CONTENT_PICTURE, TAG, CREATE_DATE, UPDATE_DATE FROM ${TABLE_NAME} WHERE ID = $1`;
        const values = [id];
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
                console.error('Não foi possível deletar o conteúdo! ', err.message);
            }finally{
                client.release();
            }
        }else{
            throw new Error('O conteúdo não existe!');
        }
    }

    static async findAll(offset = 0){
        const query = `SELECT EC.ID, EC.TITLE, EC.CONTENT, ENCODE(EC.CONTENT_PICTURE,'escape') as CONTENT_PICTURE, EC.TAG, EC.CREATE_DATE, EC.UPDATE_DATE, UA.NAME AS USERNAME, EC.USER_ID
                        FROM ${TABLE_NAME} EC
                        INNER JOIN USER_ACCOUNT UA
                        ON UA.ID = EC.USER_ID
                        ORDER BY EC.CREATE_DATE DESC
                        LIMIT 10 OFFSET $1`;
        const value = [offset];
        
        const result = await pool.query(query, value);

        return result.rows;

    }

    static async update(columns, values, contentId, userId){
        const client = await pool.connect();
        try {
            const queryToFindOne = `SELECT ID, TITLE, CONTENT, CONTENT_PICTURE, TAG, CREATE_DATE, UPDATE_DATE FROM ${TABLE_NAME} WHERE ID = $1 AND USER_ID = $2`;
            const valuesToFindOne = [contentId, userId];

            const findOneResult = await client.query(queryToFindOne, valuesToFindOne);
            const find = findOneResult.rows[0];

            if(find){
                const setQuery = columns.map((col, idx) => `${col} = $${idx + 1}`).join(', ');

                const query = `UPDATE ${TABLE_NAME} SET ${setQuery} WHERE id = $${columns.length + 1} RETURNING ID, TITLE, CONTENT, TAG, ENCODE(CONTENT_PICTURE,'escape') as CONTENT_PICTURE, CREATE_DATE, UPDATE_DATE`;

                const result = await client.query(query, [...values, contentId]);

                await client.query('COMMIT');

                const selectQuery = `SELECT EC.ID, EC.TITLE, EC.CONTENT, ENCODE(EC.CONTENT_PICTURE,'escape') as CONTENT_PICTURE, EC.TAG, EC.CREATE_DATE, EC.UPDATE_DATE, UA.NAME AS USERNAME, EC.USER_ID
                        FROM ${TABLE_NAME} EC
                        INNER JOIN USER_ACCOUNT UA
                        ON UA.ID = EC.USER_ID
                        WHERE EC.ID = $1`;
                const selectValue = [result.rows[0].id];

                const contentUpdated = await client.query(selectQuery, selectValue);

                return contentUpdated.rows[0];

            }else{
                throw new Error(`O conteúdo não existe ou você não tem permissão para editá-lo!`);
            }

        } catch (err) {
            await client.query('ROLLBACK');
            throw new Error(err.message);
        }finally{
            client.release();
        }
    }

}