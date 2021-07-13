const fs = require('fs')

class DB {
    constructor() {
        this._data = {}
    }

    initSync(path) {
        let data = JSON.parse(fs.readFileSync(path))
        this._data.locations = data.locations.sort((first, second) => first.id > second.id)
        this._data.alarms = data.alarms
            .sort((first, second) => new Date(first.timestamp) > new Date(second.timestamp))
            .map(entry => {
                return { ...entry, location: this._data.locations.find(location => location.id == entry.location) }
            })
    }

    async listAlarms({ timestamp_range, outcome }) {
        let alarms = this._data.alarms
        return new Promise(resolve => {
            if (timestamp_range) {
                let [start_date, end_date] = timestamp_range
                alarms = alarms.filter(alarm => {
                    let alarm_date = new Date(alarm.timestamp)
                    return alarm_date >= new Date(start_date) && alarm_date <= new Date(end_date)
                })
            }

            if (typeof outcome !== 'undefined') {
                alarms = alarms.filter(alarm => alarm.outcome === outcome)
            }

            resolve(alarms)
        })
    }

}

module.exports = DB