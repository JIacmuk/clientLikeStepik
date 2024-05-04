//конфиг
require('dotenv').config()
//подключаем клиента из бд
const pool = require('./models/db')

//различные либы 
const express = require('express')
const cors = require('cors')
//роутер для взаимодействия
const apiRouter = require('./routes/apiRouter')
//Объект для работы с сервером
const app = express()

//заплатка, чтобы не блокал браузер при попытке отправки запроса с одного и того же доменного имени возможно и не пригодится
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));

// работа с файлами
app.use(express.json())

//подключаем роутер
app.use('/api', apiRouter)

//получаем порт 
const PORT = process.env.PORT || 5000
const host = '192.168.0.241';

async function initServer() {
    try {
        //подключаем БД postgreSQL
        await pool.connect().then(() => console.log('Успешное подключение к базе данных'))
                            .catch(err => console.log('Ошибка подключения:', err));
        //тестовый запрос
        //const result = await pool.query(`SELECT balance AS value from accounts`)
        //console.log(result)
        //подключаем сервер
        app.listen(PORT, host, () => {
            console.log(`Server Starting at: ${process.env.SERVER_URL} `)
        })
    } 
    catch(e) {
        console.log(e)
    }
}

//запускаем 
initServer()

