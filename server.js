const express = require('express')
const app = express()
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const expressLayouts = require('express-ejs-layouts')
const User = require('./models/user')
const Channel = require('./models/channel')
const Interest = require('./models/interest')
const Post = require('./models/post')
const dotenv = require('dotenv').config()
const mongoose = require("mongoose")
const config = require("./configuration/config")
const cookieParser = require('cookie-parser')
const FacebookStrategy = require('passport-facebook').Strategy
const google = require('googleapis');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const {setUpSocketBasedChat} = require('./socketBasedChat');

// data = ["bit manipulation", "logic puzzles", "OO design", "recursion", "sorting", "searching"]

// Channel.findOne({name: "Algorithms"}, (err, channel)=>{
//  if(err){
//    console.log(err)
//  }else {
//    data.forEach(function(item){
//      channel.tag.push(item)
//    })
//    channel.save()
//    console.log(channel)
//  }
// })

//database connection
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Connected Database Successfully')
})

// Requiring routes
const indexRoutes = require('./routes/index')
const channelRoutes = require('./routes/channels')
const postRoutes = require('./routes/posts')

// Use static file for css, urlencoded for req.body, and methodOverride
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser());
app.use(methodOverride('_method'))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)

//PASSPORT CONFIGURATION
app.use(
    require('express-session')({
        secret: 'anything can go here',
        resave: false,
        saveUninitialized: false,
    }),
)
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(function (user, done) {
    done(null, user)
})
passport.deserializeUser(function (obj, done) {
    User.findById(obj._id, (err, foundUser) => {
        if (err) {
            console.log(err)
        } else {
            done(null, foundUser.toObject())
        }
    })
})

// //Google Auth
// passport.use(new GoogleStrategy({
//   clientID: config.google_client_id,
//   clientSecret: config.google_client_secret,
//   callbackURL: "http://localhost:3000/auth/google/callback"
// },
// function(accessToken, refreshToken, profile, done) {
//     userProfile=profile;
//     return done(null, userProfile);
// }
// ));

//Facebook Auth
passport.use(new FacebookStrategy({ //This is class constructor argument telling Passport to create a new Facebook Auth Strategy
        clientID: config.facebook_api_key,//The App ID generated when app was created on https://developers.facebook.com/
        clientSecret: config.facebook_api_secret,//The App Secret generated when app was created on https://developers.facebook.com/
        callbackURL: config.callback_url,
        profile: ['id', 'displayName'] // You have the option to specify the profile objects you want returned
    },
    function (accessToken, refreshToken, profile, done) {
        //Check the DB to find a User with the profile.id
        User.findOne({facebook_id: profile.id}, function (err, user) {//See if a User already exists with the Facebook ID
            if (err) {
                console.log(err);  // handle errors!
            }

            if (user) {
                done(null, user); //If User already exists login

            } else { //else create a new User
                user = new User({
                    facebook_id: profile.id, //pass in the id and displayName params from Facebook
                    username: profile.displayName
                });
                user.save(function (err) { //Save User if there are no errors else redirect to login route
                    if (err) {
                        console.log(err);  // handle errors!
                    } else {
                        console.log("saving user ...");
                        done(null, user);
                    }
                });
            }
        });
    }
));

//A MIDDLEWARE FOR EVERY ROUTE IN ORDER TO REQ.USER
app.use(function (req, res, next) {
    res.locals.currentUser = req.user
    next()
})

// Use routes
app.use('/', indexRoutes)
app.use('/channel', channelRoutes)
app.use('/channel/:user_id', postRoutes)

const server = setUpSocketBasedChat(app);

server.listen(3000, () => {
    console.log('app is listening on port 3000')
})
