const express = require('express')
const DB = require('./db')
const paginator = require('./paginator')

const app = express()
app.db = new DB()
app.db.initSync('./data/sample.json')


app.get('/alarms/', async (req, res) => {
    let results = await app.db.listAlarms()
    let page_config = {
        page: parseInt(req.query.page) || 1,
        page_size: parseInt(req.query.page_size) || 10,
        no_page: req.query.no_page
    }

    res.status(200).json(paginator.paginate(results, page_config))
})

module.exports = app