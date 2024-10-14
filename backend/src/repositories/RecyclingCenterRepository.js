import pool from "../../db/conn.js";

const TABLE_NAME = 'RECYCLING_CENTER';

export default class RecyclingCenterRepository{

    static async create(recyclingCenterData){
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const {
                name, 
                street, 
                number,
                complement,
                postal_code: postalCode, 
                state,
                city,
                opening_hour: openingHour,
                phone_number: phoneNumber
            } = recyclingCenterData;
            const query = `INSERT INTO ${TABLE_NAME} 
                            (NAME, STREET, NUMBER, COMPLEMENT, POSTAL_CODE, STATE, CITY, OPENING_HOUR, PHONE_NUMBER) 
                            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
            const values = [name, street, number, complement, postalCode, state, city, openingHour, phoneNumber];
            const result = await client.query(query, values);
            await client.query('COMMIT');

            return result.rows[0];
            
        } catch (err) {
            await client.query('ROLLBACK');
            throw new Error(`Erro ao cadastrar o ponto de coleta e descarte: ${err.message}`)
        }finally{
            client.release();
        }
    }

    static async remove(){}

    static async findAll(){}

    static async update(){}
}