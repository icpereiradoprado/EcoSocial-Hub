//Importa o pool de conexão do banco
import pool from "../../db/conn.js";
//Importação apenas para tipagem na documentação das funções
import UserModel from "../models/UserModel.js"; 

//Armazena o nome da tabela
const TABLE_NAME = 'USER_ACCOUNT';

/**
 * Classe repository para os Usuários
 */
export default class UserRepository{
    /**
     * Perisiste um novo usuário no banco
     * @param {UserModel} userData Objeto que representa um Usuário
     * @param {string} passwordHash Senha criptografada
     * @returns novo Usuário
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
            //Desestrutura os dados do objeto userData
            const { name, email, city, phone_number: phoneNumber } = userData;

            //Query para inserir um novo usuário
            const query = `INSERT INTO ${TABLE_NAME} (NAME, EMAIL, PHONE_NUMBER, CITY, PASSWORD) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
            const values = [name.trim(), email.trim(), phoneNumber.trim(), city.trim(), passwordHash];

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
        //Armazena uma conexão com o banco de dados, retirado do pool de conexões
        const client = await pool.connect();

        try{
            //Inicia uma transação no banco de dados
            await client.query('BEGIN');

            //Query de remoção. Obs.: os parâmetros $1, $2, etc. São utilzados para evitar SQL Injection
            const query = `DELETE FROM ${TABLE_NAME} WHERE ID = $1`;
            //Valor que irá substituir o parâmetro indicado por $ na query
            const value = [id];

            //Executa a query para deletar um usuário
            await client.query(query, value);
            
            //Realiza o commit da transação no banco de dados
            await client.query('COMMIT');

            return;

        }catch(err){
            //Caso ocorra algum erro durante a remoção do Usuário
            //Realiza um ROLLBACK da transação do banco de dados
            await client.query('ROLLBACK');
            //Dispara uma mensagem de Erro
            throw new Error(`Erro ao remover usuário: ${err.message}`);
        }finally{
            //Libera a conexão de volta ao pool de conexões, para permitir que a conexão
            //seja reutilizada por outras operações
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
        //Query para buscar um usuário pelo e-mail ou nome. 
        //Obs.: os parâmetros $1, $2, etc. São utilzados para evitar SQL Injection
        const query = `SELECT * FROM ${TABLE_NAME} WHERE NAME = $1 or EMAIL = $2`;
        //Valores que irão substituir os parâmetros indicados por $ na query
        const values = [name, email];
        //Armazena o resultado retornado através da query
        const result = await pool.query(query, values);
        //Retorna o Usuário encontrado pelo nome ou e-mail
        return result.rows[0];
    }

    /**
     * Busca um usuário pelo id
     * @param {Number} id Id do usuário
     * @param {string} email E-mail do usuário
     * @returns UserModel
     */
    static async findById(id){
        //Query para buscar um usuário. Obs.: os parâmetros $1, $2, etc. São utilzados para evitar SQL Injection
        const query = `SELECT ID, NAME, EMAIL, CITY, PHONE_NUMBER AS phoneNumber, 
            ENCODE(PROFILE_PICTURE, 'escape') as PROFILE_PICTURE, IS_ADMIN FROM ${TABLE_NAME} WHERE ID = $1`;
        //Valor que irá substituir o parâmetro indicado por $ na query
        const values = [id];
        //Armazena o resultado retornado através da query
        const result = await pool.query(query, values);
        //Retorna o usuário
        return result.rows[0];
    }

    /**
     * Método para atualizar os dados de um determinado Usuário
     * @param {Array} columns Colunas a serem alteradas
     * @param {Array} values valores alterados
     * @param {number} userId Id do Usuário
     */
    static async update(columns, values, userId){
        //Armazena uma conexão com o banco de dados, retirado do pool de conexões
        const client = await pool.connect();

        try{
            //Inicia uma transação no banco de dados
            await client.query('BEGIN');
            //Cria a query de acordo com as colunas que seão editas
            //Isso permite que a query de edição seja flexível
            const setQuery = columns.map((col, idx) => `${col} = $${idx + 1}`).join(', ');

            //Query para atualizar os dados do Usuário
            const query = `UPDATE ${TABLE_NAME} SET ${setQuery} WHERE id = $${columns.length + 1}`;

            //Executa a query para atualizar o usuário
            await client.query(query, [...values, userId]);
            
            //Realiza o commit da transação no banco de dados
            await client.query('COMMIT');
        }catch(err){
            //Caso ocorra algum erro durante a atualização do Usuário
            //Realiza um ROLLBACK da transação do banco de dados
            await client.query('ROLLBACK');
            //Dispara uma mensagem de Erro
            throw new Error(`Erro ao editar usuário: ${err.message}`);
        }finally{
            //Libera a conexão de volta ao pool de conexões, para permitir que a conexão
            //seja reutilizada por outras operações
            client.release();
        }
    }

}