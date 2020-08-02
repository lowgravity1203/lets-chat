const express = require("express")
const route = express.Router()
const User = require("../models/user")
const Post = require('../models/post')

// let ev = User.findOne({username: "ev"})
// console.log(ev.id)

// let posts = { 
//     text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
//     date: 2018-09-19,
//     tage: "dolor sit amet"
//  }

Post.create(posts, (err, createdPost)=> {
    if(err){
        console.log(err)
    } else{
        console.log(createdPost)
    }
})

// Get index route
route.get("/", (req, res) => {
    res.render("channels/index")
})








module.exports = route