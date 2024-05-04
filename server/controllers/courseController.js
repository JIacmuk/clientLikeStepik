const { resourceLimits } = require('worker_threads');
const db = require('../models/db')
const jwt = require('jsonwebtoken');
const { isUndefined } = require('util');

//функция поиска всех курсов по принадлежности пользователя
async function coursesByUser(division) {
    const result = 
    await db.query(`
        SELECT c.id, c.name, c.description, c.complete_time
        FROM "Course" c 
        LEFT JOIN "Division" d 
            ON d.id = c.division 
        LEFT JOIN "User" u 
            ON u.division = d.id 
        WHERE u.id = $1`, [division]);
    return result
}

//функция нахождения пользователя по id
async function userByUserId(id) {
    const result = await db.query('SELECT * FROM "User" WHERE id = $1', [id])
    return result.rows[0]
}

//вывод всех курсов
class courseController {
    async courses(req, res) {
        try {
            //распарсим токен id пользователя 
            const token = req.headers.authorization.split(' ')[1]
            console.log(`Токен ${token}`)
            const decodedData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            const user_id = decodedData.id
            console.log(`Инфа с токенов ${decodedData}`)
            //находим пользователя по его айдишке
            const courses = await coursesByUser(user_id)

            const filteredData = courses.rows.map(item => {
                const { id,  name, description, complete_time } = item;
                return { id,  name, description, complete_time };
            });

            return res.json(filteredData)
        } catch (error) {
            console.log(error)
            res.status(400).json({message: 'All courses error'})
        }
    }
    async oneCourse(req, res) {
        try {
            //получаем айдишник курса
            const courseId = req.params.course_id
            //распарсим токен id пользователя 
            const token = req.headers.authorization.split(' ')[1]
            const decodedData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            
            const user_id = decodedData.id

            //находим пользователя по его айдишке
            const courses = await coursesByUser(user_id)
            console.log(courses.rows.id)

            //находим по id 
            const findItem = courses.rows.find(item => item.id == courseId)
            //проверяем на наличие
            if(!findItem) return res.status(400).json({message: 'Курс либо не существует, либо к нему нет доступа у данного пользователя'})
            return res.json(findItem)

        } catch (error) {
            console.log(error)
            res.status(400).json({message: 'One courses error'})
        }
    }
    async lessons(req, res) {
        try {
            //получаем айдишник курса
            const courseId = req.params.course_id
            //распарсим токен id пользователя 
            const token = req.headers.authorization.split(' ')[1]
            const decodedData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            const user_id = decodedData.id

            //находим пользователя по его айдишке
            const courses = await coursesByUser(user_id)
            console.log(courses.rows.id)

            //находим по id 
            const findItem = courses.rows.find(item => item.id == courseId)
            //проверяем на наличие
            if(!findItem) return res.status(400).json({message: 'Курс либо не существует, либо к нему нет доступа у данного пользователя'})
            //продолжаем работу с курсом 
            
            //сделаем работу с главами
            //console.log(findItem)
            const result = await db.query(`SELECT ch.id, ch.name FROM "Chapter" ch
            JOIN "Course" c
            ON c.id = ch.course
            WHERE c.id = $1
            ORDER BY ch.id ASC`,[findItem.id])

            console.log(result.rows)
            //создаем поле description для рендера его на клиенте 
            const description = `
            <h1>Что такое потоки?</h1>
            <iframe width="560" height="315" src="https://www.youtube.com/watch?v=srou9ZGSnhQ&ab_channel=St.ToddHoward" 
            title="YouTube video player" frameborder="0" allow="accelerometer;
            autoplay; clipboard-write; encrypted-media; gyroscope; 
            picture-in-picture" allowfullscreen></iframe>
            `
            //дополняем данные
            
            result.rows.forEach((item, index) => {
                item.description = description;
              });
            console.log(result.rows)
            return res.json(result.rows)

        } catch (error) {
            console.log(error)
            res.status(400).json({message: 'Lessons error'})
        }
    }
}

module.exports = new courseController()