import pool from "../db/conn.js";

const TABLE_NAME = 'user_accounts';//Nome da tabela de usuários

/**
 * Classe Usuário
 */
class User{
    
    constructor(id, name, email, phoneNumber){
        this.id = id;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }

    /**
     * Busca um usuário pelo id
     * @param {number} id ID do usuário
     */
    static async findById(id){
        const query = `SELECT * FROM ${TABLE_NAME} WHERE id = $1`; //Query para buscar um usuário pelo ID
        const values = [id]; //Array de valores

        try{
            const res = await pool.query(query, values);
            if(res.rows.length > 0) {
                const user = res.rows[0];
                return new User(user.id, user.name, user.email, user.phone_number)
            }
            return null; //Usuário não encontrado
        }catch(err){
            throw new Error(`Erro ao buscar usuário: ${err.message}`);
        }
    }

    /**
     * 
     * @param {string} name Nome do usuário
     * @param {string} email E-mail do usuário
     * @param {string} phoneNumber Número do telefone do usuário
     * @param {string} passwordHash Hash da senha do usuário
     * @returns 
     */
    static async create(name, email, phoneNumber, passwordHash){
        const query = `INSERT INTO ${TABLE_NAME} (name, email, phone_number, password) VALUES ($1, $2, $3, $4) RETURNING *`;
        const values = [name, email, phoneNumber, passwordHash];

        try{
            const res = await pool.query(query, values);
            const user = res.rows[0];
            return new User(user.id, user.name, user.email, user.phoneNumber);
        }catch(err){
            throw new Error(`Erro ao criar usuário: ${err.message}`);
        }
    }
}

export default User;