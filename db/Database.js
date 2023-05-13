const mongoose = require('mongoose')
let instance = null

class Database {

    constructor() {
        if (!instance) {
            this.monjgoConnection = null
            instance = this
        }
        return instance
    }

    async connect(options) {
        try {
            let db = await mongoose.connect(options.CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
            this.monjgoConnection = db
            console.log("DB Connection");
        } catch (err) {
            console.log(err);
            process.exit(1)
        }
    }

}

module.exports = Database