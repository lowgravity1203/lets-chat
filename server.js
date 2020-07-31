const express = require("express")
const app = express()
const methodOverride = require("method-override")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user")

// Requiring routes
const indexRoutes = require("./routes/index")

// Require database info from file
require('./db/db')

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "anything can go here",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Use static file for css, urlencoded for req.body, and methodOverride
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));



// Use routes
app.use("/", indexRoutes)

app.listen(3000, ()=>{
    console.log("app is listening on port 3000")
})