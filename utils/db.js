const mongoose = require('mongoose')
const { config } = require('../config/config')

const Mongo_Uri = config.MONGO_URI

const DB_connection = async () => {
    try {
        await mongoose.connect(Mongo_Uri)
        console.log('DB connected successfully!')
    } catch (error) {
        console.log('MongoDB connection error', error.message)
        process.exit(1)
    }
}

module.exports = DB_connection