import pool from "../../db/conn.js";

const TABLE_NAME = 'EDUCATIONAL_CONTENT';

export default class EducationalContentRepository{

    static async create(contentData){
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const { title, content, tag, userId, content_picture } = contentData;
            const query = `INSERT INTO ${TABLE_NAME} (TITLE, CONTENT, TAG, USER_ID, CONTENT_PICTURE) VALUES($1, $2, $3, $4, $5) RETURNING *`;
            const values = [title, content, tag, userId, content_picture];
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

    static async remove(id){
        const queryToFindOne = `SELECT ID, TITLE, CONTENT, CONTENT_PICTURE, TAG, CREATE_dATE, UPDATE_DATE FROM ${TABLE_NAME} WHERE ID = $1`;
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

    static async findAll(){
        const query = `SELECT EC.ID, EC.TITLE, EC.CONTENT, ENCODE(EC.CONTENT_PICTURE,'escape') as CONTENT_PICTURE, EC.TAG, EC.CREATE_DATE, EC.UPDATE_DATE, UA.NAME AS USERNAME, EC.USER_ID
                        FROM ${TABLE_NAME} EC
                        INNER JOIN USER_ACCOUNT UA
                        ON UA.ID = EC.USER_ID
                        ORDER BY EC.CREATE_DATE DESC`;
        
        const result = await pool.query(query);

        return result.rows;

    }

    static async update(){

    }

    static async findById(id){
        const query = `SELECT ID, TITLE, CONTENT, CONTENT_PICTURE, TAG, CREATE_dATE, UPDATE_DATE
        FROM ${TABLE_NAME} WHERE ID = $1`;
        const values = [id];
        
        const result = await pool.query(query, values);

        return 

    }

}