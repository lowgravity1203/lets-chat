const mongoose = require("mongoose")


const postSchema = new mongoose.Schema({
    text: String,
    tag: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    replies: [{
            author: {
                    id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User'  
                    },
                    username: String
            }
    }]
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post