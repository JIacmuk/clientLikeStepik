//подключаем роутер из экспресса 
const express = require('express')
const authRouter = express.Router()

//подлючаем проверку аутентификации
const authMiddlewaree = require('../middlewaree/authMiddlewaree')

//подключаем контроллеры для взаимодествиями
const authController = require('../controllers/authController')
//работа с пользователями

//для теста удалить потом!
authRouter.get('/login', authController.test)

authRouter.post('/login', authController.login)
authRouter.post('/logout', authController.logout)
//надо подумать как это сделать, чтобы регистровать мог лишь админ ==> 
//должны быть роли, скорее всего придется подклчюить отслеживание ролей и просто добавить мидлвар на проверку роли
authRouter.post('/register', authMiddlewaree, authController.registration)
module.exports = authRouter