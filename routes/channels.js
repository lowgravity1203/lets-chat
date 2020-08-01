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
    const userSelected = req.body
    const selectedInterests = Object.values(userSelected)
    const obj = {name : selectedInterests}
    User.findById(req.params.user_id, (err, foundUser) => {
        if(err){
            console.log(err)
        } else {
            foundUser.interests.push({name: selectedInterests})
            console.log(foundUser.interests)
            
        
        }
    })
    res.redirect("/channel/" + req.user.id)
})




module.exports = router