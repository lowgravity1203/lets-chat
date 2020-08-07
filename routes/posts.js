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
                    post.author.id = req.user._id
                    post.author.username = req.user.username
                    post.save()
                    channel.post.push(post)
                    channel.save()
                    res.redirect("/channel/" + req.user._id + "/" + req.params.channel)
                }
            })
        }
    }) 
})



// Handling delete post logic
router.delete("/:channel/:post_id", (req, res) => {
    Post.findByIdAndRemove(req.params.post_id, (err, deletedComment) => {
        if(err){
            console.log(err)
        } else {
            Channel.findOne({name: req.params.channel}, (err, foundChannel) => {
                if(err){
                    console.log(err)
                } else {
                    foundChannel.post.remove(req.params.post_id)
                    foundChannel.save((err, updatedChannel) => {
                        if(err){
                            console.log(err)
                        } else {
                            res.redirect("/channel/" + req.user.id + "/" + req.params.channel)
                        }
                    })
                }
            })
        }
    })
})

// Display edit page to edit a post, either with or without the option to change the tag for the post
router.get("/:channel/:post_id/edit/:includeTags", (req, res) => {
    Channel.findOne({name: req.params.channel}, (err,foundChannel) => {
        if(err){
            console.log(err)
        }else {
            Post.findById(req.params.post_id, (err, foundPost) => {
                if(err){
                    console.log(err)
                } else {
                    const showTagSelectionDropdown = req.params.includeTags === 'true';
                    res.render("posts/edit", {post: foundPost, currentChannel: foundChannel, showTagSelectionDropdown})
                }
            })
        }
    })
})

// Handle edit post logic
router.put("/:channel/:post_id/edit", (req, res) => {
    Post.findByIdAndUpdate(req.params.post_id, req.body, (err, updatedPost) => {
        if(err){
            console.log(err)
        } else {
            Channel.findOne({name: req.params.channel}, (err, foundChannel) => {
                if(err){
                    console.log(err)
                } else {
                    foundChannel.post.remove(req.params.post_id)
                    foundChannel.save((err, savedChannel) => {
                        if(err){
                            console.log(err)
                        } else {
                            foundChannel.post.push(updatedPost)
                            foundChannel.save((err, savedChannel) => {
                                if(err){
                                    console.log(err)
                                } else {
                                    res.redirect("/channel/" + req.user.id + "/" + req.params.channel)
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})


// Display form to reply to post
router.get("/:channel/:post_id/reply", (req, res) => {
  Channel.findOne({name: req.params.channel}, (err, foundChannel)=> {
    if(err)console.log(err)
    Post.findById(req.params.post_id, (err, foundPost)=> {
      if(err)console.log(err)
      res.render("posts/reply", {currentChannel: foundChannel, post: foundPost})
    })
  })
})

router.post("/:channel/:post_id/reply", (req, res) => {
  Post.findById(req.params.post_id, (err, foundPost) => {
    if(err)console.log(err)
    req.body.username = req.user.username
    foundPost.replies.push(req.body)
    foundPost.save()
    res.redirect("/channel/" + req.user.id + "/" + req.params.channel)
  })
  
})

module.exports = router