//Importa o pool de conexão do banco
import pool from "../../db/conn.js";

//Armazena o nome da tabela
const TABLE_NAME = 'RECYCLING_CENTER';

/**
 * Classe repository para os Pontos de Reciclagem
 */
export default class RecyclingCenterRepository{

    /**
     * Método para criar um Ponto de Reciclagem
     * @param {Object} recyclingCenterData Objeto contendo os valores de um novo comentário
     * @returns novo Ponto de Reciclagem
     */
    static async create(recyclingCenterData){
        //Armazena uma conexão com o banco de dados, retirado do pool de conexões
        const client = await pool.connect();
        try {
            //Inicia uma transação no banco de dados
            await client.query('BEGIN');
            //Desestrutura os dados do obejto recyclingCenterData
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
            //Query de inserção. Obs.: os parâmetros $1, $2, etc. São utilzados para evitar SQL Injection
            const query = `INSERT INTO ${TABLE_NAME} 
                            (NAME, STREET, NUMBER, COMPLEMENT, POSTAL_CODE, STATE, CITY, OPENING_HOUR, PHONE_NUMBER) 
                            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
            //Valores que irão substituir os parâmetros indicados por $ na query
            const values = [name, street, number, complement, postalCode, state, city, openingHour, phoneNumber];
            //Armazena o resultado obtido através da query
            const result = await client.query(query, values);
            //Realiza o commit da transação no banco de dados
            await client.query('COMMIT');
            //Retorna o novo Ponto de Reciclagem criado
            return result.rows[0];
            
        } catch (err) {
            //Caso ocorra algum erro durante a inserção do novo comentário
            //Realiza um ROLLBACK da transação do banco de dados
            await client.query('ROLLBACK');
            //Dispara uma mensagem de Erro
            throw new Error(`Erro ao cadastrar o ponto de coleta e descarte: ${err.message}`)
        }finally{
            //Libera a conexão de volta ao pool de conexões, para permitir que a conexão
            //seja reutilizada por outras operações
            client.release();
        }
    }

    /**
     * Método para remover um Ponto de Reciclagem
     * @param {number} id Id do Ponto de Reciclagem
     */
    static async remove(id){
        //Query de remoção. Obs.: os parâmetros $1, $2, etc. São utilzados para evitar SQL Injection
        const queryToFindOne = `SELECT ID, NAME, STREET, NUMBER, COMPLEMENT, 
            POSTAL_CODE, STATE, CITY, OPENING_HOUR, PHONE_NUMBER, CREATE_DATE, UPDATE_DATE 
            FROM ${TABLE_NAME} WHERE ID = $1`;
        //Valor que irá substituir o parâmetro indicado por $ na query
        const values = [id];
        //Armazena uma conexão com o banco de dados, retirado do pool de conexões
        const client = await pool.connect();

        //Armazena o resultado da query que traz o Ponto de Reciclagem
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
                console.error('Não foi possível deletar o ponto de colteta e descarte! ', err.message);
            }finally{
                client.release();
            }
        }else{
            throw new Error('O ponto de coleta e descarte não existe!');
        }
    }

    static async findAll(userId){
        const query = `SELECT RC.ID, RC.NAME, RC.STREET, RC.NUMBER, RC.COMPLEMENT, RC.POSTAL_CODE, RC.STATE,
                        RC.CITY, RC.OPENING_HOUR, RC.PHONE_NUMBER
                        FROM ${TABLE_NAME} RC
                        INNER JOIN USER_ACCOUNT UA
                        ON UPPER(unaccent(UA.CITY)) = UPPER(unaccent(RC.CITY))
                        WHERE UA.ID = $1
                        ORDER BY RC.NAME`;
        
        const values = [userId];
        
        const result = await pool.query(query, values);

        return result.rows;
    }

    static async update(columns, values, id){
        const client = await pool.connect();
        try {
            const queryToFindOne = `SELECT ID, NAME, STREET, NUMBER, 
                COMPLEMENT, POSTAL_CODE, STATE, CITY, 
                OPENING_HOUR, PHONE_NUMBER, CREATE_DATE, UPDATE_DATE FROM ${TABLE_NAME} WHERE ID = $1`;
            const valuesToFindOne = [id];

            const findOneResult = await client.query(queryToFindOne, valuesToFindOne);
            const find = findOneResult.rows[0];

            if(find){
                const setQuery = columns.map((col, idx) => `${col} = $${idx + 1}`).join(', ');

                const query = `UPDATE ${TABLE_NAME} SET ${setQuery} WHERE id = $${columns.length + 1} 
                RETURNING ID, NAME, STREET, NUMBER, COMPLEMENT, POSTAL_CODE, STATE, CITY, OPENING_HOUR, PHONE_NUMBER`;

                const result = await client.query(query, [...values, id]);

                await client.query('COMMIT');

                return result.rows[0];
            }else{
                throw new Error(`O ponto de coleta e descarte não existe!`);
            }

        } catch (err) {
            await client.query('ROLLBACK');
            throw new Error(err.message);
        }finally{
            client.release();
        }
    }
}