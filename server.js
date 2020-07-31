const express = require("express")
const app = express()
const methodOverride = require("method-override")
const passport = require("passport")
const LocalStrategy = require("passport-local")

// Requiring routes
const indexRoutes = require("./routes/index")

// Require database info from file
require('./db/db')





// Use routes
app.use("/", indexRoutes)

app.listen(3000, ()=>{
    console.log("app is listening on port 3000")
})