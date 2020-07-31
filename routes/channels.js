const express = require("express")
const route = express.Router()
const User = require("../models/user")

// Get index route
route.get("/", (req, res) => {
    res.render("channels/index")
})








module.exports = route