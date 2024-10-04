import pool from "../../db/conn.js";

const TABLE_NAME = 'EDUCATIONAL_CONTENT';

export default class EducationalContentRepository{

    static async create(contentData){
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const { title, content, tag, userId } = contentData;
            const query = `INSERT INTO ${TABLE_NAME} (TITLE, CONTENT, TAG, USER_ID) VALUES($1, $2, $3, $4) RETURNING *`;
            const values = [title, content, tag, userId];
            const result = await client.query(query, values);
            await client.query('COMMIT');

            return result.rows[0];
            
        } catch (err) {
            await client.query('ROLLBACK');
            throw new Error(`Erro ao cadastrar conteúdo educacional ${err.message}`)
        }finally{
            client.release();
        }
    }

    static async remove(){

    }

    static async findAll(){
        const query = `SELECT EC.ID, EC.TITLE, EC.CONTENT, EC.CONTENT_PICTURE, EC.TAG, EC.CREATE_DATE, EC.UPDATE_DATE, UA.NAME AS USERNAME, EC.USER_ID
                        FROM ${TABLE_NAME} EC
                        INNER JOIN USER_ACCOUNT UA
                        ON UA.ID = EC.USER_ID
                        ORDER BY EC.CREATE_DATE DESC`;
        
        const result = await pool.query(query);

        return result.rows;

    }

    static async update(){

    }

}