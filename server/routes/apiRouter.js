//подключаем роутер из экспресса 
const express = require('express')
const apiRouter = express.Router()
//роутеры
const authRouter = require("./authRouter")
const courseRouter = require("./courseRouter")
const CCRouter = require("./courseComplitionRouter")

//главный роутер
apiRouter.use(authRouter)
apiRouter.use(courseRouter)
//apiRouter.use(CCRouter)

module.exports = apiRouter