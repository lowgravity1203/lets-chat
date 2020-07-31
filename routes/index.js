const express = require("express")
const router = express.Router()
const passport = require("passport")
const User = require("../models/user")

// The Root Route
router.get("/", (req, res) => {
    res.render("channels/landing")
})


//Get register page
router.get("/register", (req, res) => {
    res.render("index/register")
})

//Handle register logic
router.post("/register", (req, res) => {
    const newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err)
            return res.render("index/register")
        } 
        passport.authenticate("local")(req, res, function(){
            res.redirect("/channel")
        })
    })
})

//Get login page
router.get("/login", (req, res) => {
    res.render("index/login")
})

//Handle login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/channel",
        failureRedirect: "/login"
    }), function(req, res){

})


//Logout route
router.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/")
})



module.exports = router;