const express = require("express")
const router = express.Router()
const User = require("../models/user")
const Interests = require("../models/interest")

// Get route to index/main channel page
router.get("/:user_id", (req, res) => {
    res.render("channels/index")
})

// Get route to interests page
router.get("/interests/:user_id", (req, res) => {
    Interests.find({}, (err, allInterests) => {
        if(err) console.log(err)
        res.render("channels/interests", {interests : allInterests})
    })
})

//Post route to handle interests form
router.post("/:user_id", (req, res) => {
    let selected = req.body
    console.log(selected)
    res.redirect("/channel/" + req.user.id)
})




module.exports = router