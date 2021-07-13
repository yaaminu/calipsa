const fs = require('fs')
const request = require('supertest')
const app = require('../app')

const data = JSON.parse(fs.readFileSync('./data/sample.json'))


describe("Calipsa Take Home", () => {
    /**
     * 1. list alerts should return all alerts *
     * 2. list alerts should paginate alerts by 10 by default *
     * 2. list alersts should return 400 when page query parameter is invalid
     * 3. list alerts should paginate alerts by a configurable page size *
     * 4. list alerts should support filtering by a timesamp_range *
     * 5. list alerts should support filtering by outcome * 
     * 6. list alerts should return 401 for all unauthorized requests *
     * 7. log all requests to a file - won't test
     */

    describe("GET /alarms/", () => {
        beforeAll(() => {
            let sorted_alarms = data.alarms.sort((first, second) => new Date(first.timestamp) > new Date(second.timestamp))
            alarms = sorted_alarms.map(entry => {
                entry_location = data.locations.find(item => item.id == entry.location)
                return { ...entry, location: { ...entry_location } }
            })

            test_client = request.agent(app).auth("admin", "s3cr3te")
        })

        it('should return all alarms when no_page query is present', async () => {
            let res = await test_client.get("/alarms/?no_page=1")
            expect(res.body.results).toEqual(alarms)
        })

        it('should paginate alarms results by 10 entries by default', async () => {
            let page1_res = await test_client.get("/alarms/")
            expect(page1_res.body.results).toEqual(alarms.slice(0, 10))

            let page2_res = await test_client.get("/alarms/?page=2")
            expect(page2_res.body.results).toEqual(alarms.slice(10, 20))
        })

        it('Should paginate alarms by custom page_size query parameter when present', async () => {
            let page_size = 10000
            let curr_page = 1
            let total_alarms = alarms.length
            let start = 0
            do {
                let res = await test_client.get(`/alarms/?page_size=${page_size}&page=${curr_page}`)
                expect(res.body.results).toEqual(alarms.slice(start, start + page_size))
                start += page_size
            } while (curr_page++ * page_size < total_alarms)
        })

        it('should filter alarms by timestamp_range query when present', async () => {
            let start = Math.floor((Math.random() * alarms.length * 10) % alarms.length)
            let end = Math.max(start + 35, alarms.length - 1)

            let start_date = new Date(alarms[start].timestamp)
            let end_date = new Date(alarms[end].timestamp)

            let expected = alarms.filter(alarm => new Date(alarm.timestamp) >= start_date && new Date(alarm.timestamp) <= end_date)
            // setting no_page to 1 makes the test more readable
            let res = await test_client.get(`/alarms/?no_page=1&timestamp_range=${start_date.toISOString()},${end_date.toISOString()}`)
            expect(res.body.results).toEqual(expected)
        })

        it('should filter alarms by outcome query when present', async () => {
            let outcome_is_true = alarms.filter(alarm => alarm.outcome)
            let outcome_is_false = alarms.filter(alarm => !alarm.outcome)

            true_res = await test_client.get("/alarms/?no_page=1&outcome=1")
            expect(true_res.body.results.length).toEqual(outcome_is_true.length)

            false_res = await test_client.get("/alarms/?no_page=1&outcome=0")
            expect(false_res.body.results.length).toEqual(outcome_is_false.length)
        })

        it('should return 401 for unauthorized users', async () => {
            let res = await request(app).get('/alarms/')
            expect(res.status).toEqual(401)
        })
    })
})