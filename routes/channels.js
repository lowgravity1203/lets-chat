const express = require("express")
const router = express.Router()
const User = require("../models/user")

// Get index route
router.get("/", (req, res) => {
    res.render("channels/index")
})








module.exports = router