const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")
const Interest = require('./interest')

const UserSchema = new mongoose.Schema({
    username: String,
    password: String, 
    displayName: String,
    email: String,
    interests: [{
        type: mongoose.Schema.Types.ObjectId

    }]
})


UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema)