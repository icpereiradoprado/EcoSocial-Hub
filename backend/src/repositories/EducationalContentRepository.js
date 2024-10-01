import pool from "../../db/conn.js";

const TABLE_NAME = 'EDUCATIONAL_CONTENT';

export default class EducationalContentRepository{

    static async create(contentData){
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const { title, content, tag, userId } = contentData;
            const query = `INSERT INTO ${TABLE_NAME} (TITLE, CONTENT, TAG, USER_ID) VALUES($1, $2, $3, $4) RETURNING ID, TITLE`;
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
        const query = `SELECT ID, TITLE, CONTENT, CONTENT_PICTURE, TAG, CREATE_DATE, UPDATE_DATE FROM ${TABLE_NAME}`;
        
        const result = await pool.query(query);

        return result.rows;

    }

    static async update(){

    }

}