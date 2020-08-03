const express = require("express")
const router = express.Router()
const User = require("../models/user")
const Interests = require("../models/interest")
const Channel = require("../models/channel")
const Post = require("../models/post")



// Get route to interests page
router.get("/interests/:user_id", (req, res) => {
    Interests.find({}, (err, allInterests) => {
        if(err) console.log(err)
        res.render("channels/interests", {interests : allInterests})
    })
})

//Post route to handle interests form
router.post("/:user_id", (req, res) => {
    const userSelected = req.body
    const selectedInterests = Object.values(userSelected)
    User.findById(req.params.user_id, (err, foundUser) => {
        if(err){
            console.log(err)
        } else {
            foundUser.interests.push({name: selectedInterests})
            foundUser.save()
        }
    })
    res.redirect("/channel/" + req.user.id)
})

// Get route to index/main channel page
router.get("/:user_id", (req, res) => {
    User.findById(req.params.user_id, (err, foundUser) => {
        if(err){
            console.log(err)
        } else {
            res.render("channels/index", {user: foundUser})
        }
    })
    
})

// Get route to show any channel selected by user
router.get("/:user_id/:channel", (req, res) => {
    Channel.findOne({name: req.params.channel}).populate("post").exec(function(err, foundChannel) {
        if(err){
            console.log(err)
        } else {
           res.render("channels/" + req.params.channel, {currentChannel: foundChannel})
        }
    })
})



module.exports = router