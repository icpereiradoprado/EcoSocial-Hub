// db.js
import pg from 'pg'
import dotenv from 'dotenv';


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
