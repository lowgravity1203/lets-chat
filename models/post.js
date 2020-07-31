const mongoose = require("mongoose")
const User = require('./user')

const postSchema = new mongoose.Schema({
    text: String,
    type: Date,
    tag: String,
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]

})

const Post = mongoose.model('Post', postSchema)

module.exports = Post