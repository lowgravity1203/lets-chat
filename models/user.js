const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")


const UserSchema = new mongoose.Schema({
    username: String,
    password: String, 
    displayName: String,
    email: String,
    interests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interest"
    }]
})


UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema)