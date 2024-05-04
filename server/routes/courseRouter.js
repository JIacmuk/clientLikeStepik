//подключаем роутер из экспресса 
const express = require('express')
const courseRouter = express.Router()
//подключаем роутер для взаимодействия
const courseController = require('../controllers/courseController')



//подлючаем проверку аутентификации
const authMiddlewaree = require('../middlewaree/authMiddlewaree')
//работа с пользователями
courseRouter.get('/courses',authMiddlewaree, courseController.courses)
courseRouter.get('/courses/:course_id', authMiddlewaree, courseController.oneCourse)
courseRouter.get('/courses/:course_id/lessons', authMiddlewaree, courseController.lessons)


module.exports = courseRouter