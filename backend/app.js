const { query } = require('express')
const express = require('express')
const DB = require('./db')
const paginator = require('./paginator')

const app = express()
app.db = new DB()
app.db.initSync('./data/sample.json')


app.get('/alarms/', async (req, res) => {
    let query = {}
    if (req.query.timestamp_range) {
        query.timestamp_range = req.query.timestamp_range.split(",", 2)
    }

    if (req.query.outcome !== undefined) { // could be 0 so need to actually test that it's present
        query.outcome = req.query.outcome != 0 // 0 means false
    }

    let results = await app.db.listAlarms(query)

    let page_config = {
        page: parseInt(req.query.page) || 1,
        page_size: parseInt(req.query.page_size) || 10,
        no_page: req.query.no_page
    }

    res.status(200).json(paginator.paginate(results, page_config))
})

module.exports = app