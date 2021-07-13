const express = require('express')

const app = express()

app.get('/alarms/', async (req, res) => {
    res.status(200).json({hello:'world'})
})

module.exports = app