import pool from "../../db/conn.js";

const TABLE_NAME = 'user_accounts';

export default class UserRepository{
    static async create(userData, passwordHash){
        //Valida se a senha criptografada foi passada pelo parâmetro
        if(!passwordHash){
            throw new Error('A senha não foi criptografada!');
        }

        //Pega uma conexão específica do pool
        const client = await pool.connect();

        try{
            //Inicia a transação
            await client.query('BEGIN');

            //Faz a inserção no banco de dados
            //Desestrutura os dados
            const { name, email, phone_number: phoneNumber } = userData;

            //Query para inserir um novo usuário
            const query = `INSERT INTO ${TABLE_NAME} (name, email, phone_number, password) VALUES ($1, $2, $3, $4) RETURNING *`;
            const values = [name, email, phoneNumber, passwordHash];

            // Caso a transação ocorra com sucesso, commita a transação
            await client.query('COMMIT');

            //Insere um novo usuário no BD e retorna as colunas desta operação
            const result = await pool.query(query, values);

            return result.rows[0];
            
        }catch(err){
            //Se houve algum erro durante a transação, faz o rollback
            await client.query('ROLLBACK');
            throw new Error(`Erro ao criar usuário: ${error.message}`);
        }finally{
            //Libera o cliente de volta para o pool, independente de sucesso ou erro
            client.release();
        }
    }

    static async findByNameOrEmail(name, email){
        
        const query = `SELECT * FROM ${TABLE_NAME} WHERE name = $1 or email = $2`;
        const values = [name, email];

        const result = await pool.query(query, values);

        return result.rows[0];
    }
}