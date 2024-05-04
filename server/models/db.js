//конфиг
require('dotenv').config()

const Pool = require('pg').Pool
//клиент для работы с бд
const pool = new Pool({
    host: process.env.DB_HOST,  
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: 5432, // Порт по умолчанию для PostgreSQL
})


module.exports = pool