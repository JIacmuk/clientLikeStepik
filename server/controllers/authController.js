const db = require('../models/db')
//генерация jwt токена
const jwt = require('jsonwebtoken');
//хэширование паролей
const bcrypt = require('bcrypt')

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: "24h"} )
}
//функция поиска пользователя по емейлу( уникальный идентификатор )
async function checkUserOnEmail(mail) {
    const result = await db.query('SELECT * FROM "User" WHERE mail = $1', [mail]);
    return result
}

class authController {
    async test(req, res) {
        res.send('hello')
    }
    async login(req, res) {
        try {
            const {mail, password} = req.body 
            console.log(mail, password)
            //проверяем есть ли такой пользователь уже
            const user = await checkUserOnEmail(mail);
            if (user.rows.length == 0) {
                return res.status(400).json({message: `Пользователь не найден`})
            }
            //проверяем пароль
            const validPassword = bcrypt.compareSync(password, user.rows[0].password)
            if (!validPassword) {
                return res.status(400).json({message: `Введен неверный пароль`})
            }
            const token = generateAccessToken(user.rows[0].id, user.rows[0].role) 
            console.log(token)
            return res.json({token})
        } catch (error) {
            console.log(error)
            res.status(400).json({message: 'Login error'})
        }
    }
    async logout(req, res) {

    }
    //регистрацию проводит пользователь
    async registration(req, res) {
        try {
            //парсим json с запросом
            const {name, mail, password } = req.body
            console.log(req.body)
            //проверяем есть ли такой пользователь уже
            const result = await checkUserOnEmail(mail);  
            if (result.rows.length > 0) {
                return res.status(400).json({message: "Пользователь с такой почтой уже существует  "})
            }    
               
            //если пользователя нет, то продолжаем
            //хэшируем пароль
            const hashPassword = bcrypt.hashSync(password, 7);

            //пока номер дивизии и роль задаем автоматически
            const user = await db.query(`INSERT INTO "User" 
                                (name, password, mail, role, division)
                                VALUES ($1, $2, $3, 'admin', 1) returning *`,
                                [name, hashPassword, mail])

            const token = generateAccessToken(user.rows[0].id, user.rows[0].role) 
            return res.json({message: "Пользователь успешно зарегестрирован", token})   
        } catch (error) {
            console.log(error)
            res.status(400).json({message: 'Registrarion error'})
        }                    
    }
}

module.exports = new authController()