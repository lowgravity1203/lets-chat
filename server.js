const express = require("express")
const app = express()
const methodOverride = require("method-override")
const passport = require("passport")
const LocalStrategy = require("passport-local")


app.get("/login", (req, res) => {
    res.render("login.ejs")
})

app.post("/login", (req, res) => {
    res.send("post route worked")
})

app.get("/register", (req, res) => {
    res.render("register.ejs")
})

app.post("/register", (req, res) => {
    res.send("post route worked")
})









app.listen(3000, ()=>{
    console.log("app is listening on port 3000")
})