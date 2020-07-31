const express = require("express")
const router = express.Router()
const passport = require("passport")

//Get login page
router.get("/login", (req, res) => {
    res.render("login.ejs")
})

//Handle login logic
router.post("/login", (req, res) => {
    res.send("post route worked")
})

//Get register page
router.get("/register", (req, res) => {
    res.render("register.ejs")
})

//Handle register logic
router.post("/register", (req, res) => {
    res.send("post route worked")
})


//Logout route
router.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/")
})






module.exports = router;