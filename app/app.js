const { request } = require('express')
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('hello world')
})

app.listen(port, () => {
    console.log('listening on port', port)
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