const mongoose = require("mongoose")

const interestSchema = new mongoose.Schema({
    name: String
})

const Interest = mongoose.model('Interest', interestSchema)

module.exports = Interest