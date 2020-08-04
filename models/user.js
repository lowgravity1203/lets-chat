const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")


const UserSchema = new mongoose.Schema({
    password: String, 
    name: String,
    facebook_id: String,
    email: String,
    interests: [{
        name: [String]
    }]
})


UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema)