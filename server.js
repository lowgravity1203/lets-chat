const express = require("express")
const methodOverride = require("method-override")
const bodyParser = require("body-parser")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user")
const mongoose = require("mongoose")
const dotenv = require('dotenv').config()
const app = express()


// Requiring routes
const indexRoutes = require("./routes/index")
const channelRoutes = require("./routes/channels")
const Interest = require("./models/interest")

//database connection
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', () => {
	console.log('Connected Database Successfully')
})

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
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride("_method"));
app.use(bodyParser.json())
app.set("view engine", "ejs");

//A MIDDLEWARE FOR EVERY ROUTE IN ORDER TO REQ.USER
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
})


// Use routes
app.use("/", indexRoutes)
app.use("/channel", channelRoutes)

app.listen(3000, ()=>{
    console.log("app is listening on port 3000")
})







	

