const express = require('express')
const DB = require('./db')

const app = express()
app.db = new DB()
app.db.initSync('./data/sample.json')


app.get('/alarms/', async (req, res) => {
    results = await app.db.listAlarms()
    res.status(200).json({results})
})

module.exports = app