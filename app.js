const { request } = require('express')
const express = require('express')
const hymn = require('./models/hymn')
const app = express()
const port = 3000
const db = require('./models') // 특정 디렉토리만 적어줘도 그 아래에 있는 index.js 파일을 자동으로 찾음
const { Hymn } = db



app.get('/', (req, res) => {
    res.send('hello world')
})

app.listen(port, () => {
    console.log('listening on port', port)
})

app.get('/api/hymns', async (req, res) => {
    const { number } = req.query
    const hymns = await Hymn.findAll({ where: { "number" : number} })
    res.send(hymns)

})

app.get('/db_status', (req, res) => {
    if(!pool) {
        const pool = db.createPool({
            host : 'docker-mysql',
            user : 'root',
            password : 'password',
            database : 'today_hymn',
            port : 3306
        })
    }
    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err)
            res.send(err.message)
        } else {
            connection.release()
            res.send('connection established')
        }
    })
})