const jwt = require('jsonwebtoken')
//подключаем использование конфига
require('dotenv').config()

module.exports = function (req, res, next) {
    //пропускаем промежуточные мидлвары
    if (req.method === "OPTIONS") {
        next()
    }
    // обрабатываем наш мидлвар
    try {
        const token = req.headers.authorization.split(' ')[1]
        //если токена нет
        if (!token) {
            return res.status(403).json({message: "Пользователь не авторизован - не получается найти"})
        }
        const decodedData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        req.user = decodedData
        next()
    } catch (e) {
        console.log(e)
        return res.status(403).json({message: "Пользователь не авторизован"})
    }
};