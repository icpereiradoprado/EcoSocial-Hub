import pg from 'pg' //Importa o cliente do PostgreSQL para o Node.js
import dotenv from 'dotenv'; //Permite carregar o variáveis de ambiente do arquivo `.env`


//Traz a classe Pool que permite criar e gerenciar um pool de conexões com o banco de dados
const { Pool } = pg;
// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Configuração da conexão usando as variáveis do .env
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export default pool;
