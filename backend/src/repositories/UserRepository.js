import pool from "../../db/conn.js";
import UserModel from "../models/UserModel.js"; //Importação apenas para tipagem na documentação das funções

const TABLE_NAME = 'USER_ACCOUNT';

export default class UserRepository{
    /**
     * Perisiste um novo usuário no banco
     * @param {UserModel} userData Objeto que representa um Usuário
     * @param {string} passwordHash Senha criptografada
     * @returns 
     */
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
            const { name, email, city, phone_number: phoneNumber } = userData;

            //Query para inserir um novo usuário
            const query = `INSERT INTO ${TABLE_NAME} (NAME, EMAIL, PHONE_NUMBER, CITY, PASSWORD) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
            const values = [name, email, phoneNumber, city, passwordHash];

            //Insere um novo usuário no BD e retorna as colunas desta operação
            const result = await client.query(query, values);

            // Caso a transação ocorra com sucesso, commita a transação
            await client.query('COMMIT');

            return result.rows[0];
            
        }catch(err){
            //Se houve algum erro durante a transação, faz o rollback
            await client.query('ROLLBACK');
            throw new Error(`Erro ao criar usuário: ${err.message}`);
        }finally{
            //Libera o cliente de volta para o pool, independente de sucesso ou erro
            client.release();
        }
    }

    /**
     * Remove um usuário
     * @param {Number} id Id do usuário
     */
    static async remove(id) {
        const client = await pool.connect();

        try{
            await client.query('BEGIN');

            const query = `DELETE FROM ${TABLE_NAME} WHERE ID = $1`;
            const value = [id];

            await client.query(query, value);

            await client.query('COMMIT');

            return;

        }catch(err){
            await client.query('ROLLBACK');
            throw new Error(`Erro ao remover usuário: ${err.message}`);
        }finally{
            client.release();
        }
        
    }

    /**
     * Busca um usuário pelo nome ou e-mail
     * @param {string} name Nome do usuário
     * @param {string} email E-mail do usuário
     * @returns UserModel 
     */
    static async findByNameOrEmail(name, email){
        const query = `SELECT * FROM ${TABLE_NAME} WHERE NAME = $1 or EMAIL = $2`;
        const values = [name, email];

        const result = await pool.query(query, values);

        return result.rows[0];
    }

    /**
     * Busca um usuário pelo id
     * @param {Number} id Id do usuário
     * @param {string} email E-mail do usuário
     * @returns UserModel
     */
    static async findById(id){
        const query = `SELECT ID, NAME, EMAIL, CITY, PHONE_NUMBER AS phoneNumber, ENCODE(PROFILE_PICTURE, 'escape') as PROFILE_PICTURE, IS_ADMIN FROM ${TABLE_NAME} WHERE ID = $1`;
        const values = [id];

        const result = await pool.query(query, values);

        return result.rows[0];
    }

    static async update(columns, values, userId){
        const client = await pool.connect();

        try{
            await client.query('BEGIN');
            const setQuery = columns.map((col, idx) => `${col} = $${idx + 1}`).join(', ');

            const query = `UPDATE ${TABLE_NAME} SET ${setQuery} WHERE id = $${columns.length + 1}`;

            await client.query(query, [...values, userId]);

            await client.query('COMMIT');
        }catch(err){
            await client.query('ROLLBACK');
            throw new Error(`Erro ao editar usuário: ${err.message}`);
        }finally{
            client.release();
        }
    }

}