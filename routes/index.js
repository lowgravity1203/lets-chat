const express = require("express")
const router = express.Router()
const passport = require("passport")
const User = require("../models/user")

// Get landing page
router.get("/", (req, res) => {
    res.render("landing.ejs")
})


//Get register page
router.get("/register", (req, res) => {
    res.render("register.ejs")
})

//Handle register logic
router.post("/register", (req, res) => {
    const newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err)
            return res.render("register.ejs")
        } 
        passport.authenticate("local")(req, res, function(){
            res.redirect("/")
        })
    })
})

//Get login page
router.get("/login", (req, res) => {
    res.render("login.ejs")
})

//Handle login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/",
        failureRedirect: "/login"
    }), function(req, res){

})


//Logout route
router.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/")
})






module.exports = router;