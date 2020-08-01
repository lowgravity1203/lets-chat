const mongoose = require("mongoose")
const Interest = require('./interest')
const Post = require('./post')

const chatroomSchema = new mongoose.Schema({
    interest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interest'  
    },
    post: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]

})

const Chatroom = mongoose.model('Chatroom', chatroomSchema)

module.exports = Chatroom