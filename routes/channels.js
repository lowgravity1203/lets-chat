const express = require("express")
const router = express.Router()
const User = require("../models/user")
const Interests = require("../models/interest")

// Get route to index/main channel page
router.get("/", (req, res) => {
    res.render("channels/index")
})

// Get route to interests page
router.get("/interests", (req, res) => {
    Interests.find({}, (err, allInterests) => {
        if(err) console.log(err)
        res.render("channels/interests", {interests : allInterests})
    })
    
})






module.exports = router