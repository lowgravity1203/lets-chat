const express = require("express")
const router = express.Router()
const User = require("../models/user")
const Interests = require("../models/interest")
const Channel = require("../models/channel")
const Post = require("../models/post")


// Handle posting logic
router.post("/:channel", (req, res) => {
    Channel.findOne({name: req.params.channel}, (err, channel) => {
        if(err){
            console.log(err)
        } else {
            Post.create(req.body, (err, post) => {
                if(err){
                    console.log(err)
                } else {
                    post.author.id = req.user.id
                    post.author.username = req.user.username
                    post.save()
                    channel.post.push(post)
                    channel.save()
                    res.redirect("/channel/" + req.params.user_id + "/" + req.params.channel)
                }
            })
        }
    }) 
})

// Handling delete post logic
router.delete("/:channel/:comment_id", (req, res) => {
    Post.findByIdAndRemove(req.params.comment_id, (err, deletedComment) => {
        if(err){
            console.log(err)
        } else {
            Channel.findOne({name: req.params.channel}, (err, foundChannel) => {
                if(err){
                    console.log(err)
                } else {
                    foundChannel.post.remove(req.params.comment_id)
                    foundChannel.save((err, updatedChannel) => {
                        if(err){
                            console.log(err)
                        } else {
                            res.redirect("/channel/" + req.params.user_id + "/" + req.params.channel)
                        }
                    })
                }
            })
        }
    })
})

module.exports = router