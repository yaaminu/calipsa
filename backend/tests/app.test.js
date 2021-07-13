const request = require('supertest')
const app = require('../app')

describe("Calipsa Take Home", () => {
    /**
     * 1. list alerts should return all alerts
     * 2. list alerts should paginate alerts by 10 by default
     * 3. list alerts should paginate alerts by a configurable page size
     * 4. list alerts should support filtering by a timesamp_range 
     * 5. list alerts should support filtering by outcome
     * 6. list alerts should return 401 for all unauthorized requests
     * 7. log all requests to a file - won't test
     */

    it('should work', async () => {
        res = await request(app).get("/alarms/")
        expect(res.body.hello).toBe('world')
    })
})