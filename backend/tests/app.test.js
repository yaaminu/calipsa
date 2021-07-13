const fs = require('fs')
const request = require('supertest')
const app = require('../app')

const data = JSON.parse(fs.readFileSync('./data/sample.json'))


describe("Calipsa Take Home", () => {
    /**
     * 1. list alerts should return all alerts *
     * 2. list alerts should paginate alerts by 10 by default *
     * 2. list alersts should return 400 when page query parameter is invalid
     * 3. list alerts should paginate alerts by a configurable page size
     * 4. list alerts should support filtering by a timesamp_range 
     * 5. list alerts should support filtering by outcome
     * 6. list alerts should return 401 for all unauthorized requests
     * 7. log all requests to a file - won't test
     */

    describe("GET /alarms/", () => {
        beforeAll(() => {
            let sorted_alarms = data.alarms.sort((first, second) => new Date(first.timestamp) > new Date(second.timestamp))
            alarms = sorted_alarms.map(entry => {
                entry_location = data.locations.find(item => item.id == entry.location)
                return { ...entry, location: entry_location }
            })
        })

        it('should return all alarms when no_page query is present', async () => {
            let res = await request(app).get("/alarms/?no_page=1")
            expect(res.body.results).toEqual(alarms)
        })

        it('should paginate alarms results by 10 entries by default', async () => {
            let page1_res = await request(app).get("/alarms/")
            expect(page1_res.body.results).toEqual(alarms.slice(0, 10))

            let page2_res = await request(app).get("/alarms/?page=2")
            expect(page2_res.body.results).toEqual(alarms.slice(10, 20))
        })

        it('Should paginate alarms by custom page_size query parameter when present', async () => {
            let page_size = 10000
            let curr_page = 1
            let total_alarms = alarms.length
            let start = 0
            do {
                let res = await request(app).get(`/alarms/?page_size=${page_size}&page=${curr_page}`)
                expect(res.body.results.length).toEqual(alarms.slice(start, start + page_size).length)
                start += page_size
            } while (curr_page++ * page_size < total_alarms)
        })
    })
})