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

    async listAlarms() {
        return this._data.alarms
    }

}

module.exports = DB