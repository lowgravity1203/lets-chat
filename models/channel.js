const mongoose = require('mongoose')

const channelSchema = new mongoose.Schema({
  name: String,
  post: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  tag: [String],
})

const Channel = mongoose.model('Channel', channelSchema)

module.exports = Channel
