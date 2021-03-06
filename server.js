const express = require('express')
const bodyParser = require('body-parser')
const LocalStrategy = require('passport-local')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const config = require('./configuration/config')
const cookieParser = require('cookie-parser')
const FacebookStrategy = require('passport-facebook').Strategy
const { setUpSocketBasedChat } = require('./socketBasedChat')

//session middleware
const session = require('express-session')
const passport = require('passport')
const MongoStore = require('connect-mongo')(session)
const methodOverride = require('method-override')

// load env vars
require('dotenv').config()

// init app
const app = express()
const PORT = process.env.PORT || 3000

// models
const User = require('./models/user')
const Post = require('./models/post')

//database connection
dbURI = process.env.ATLAS_URI
dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
}
const dbConnect = async () => {
  const db = mongoose.connection
  try {
    await mongoose.connect(dbURI, dbOptions)
    console.log(`mongoose connected open on ${dbURI}`)
    db.once('open', () => {
      console.log('c')
    })
  } catch (err) {
    db.on('error', (err) => console.error(`error on ${err}`))
  }
}
dbConnect()

// Requiring routes
const indexRoutes = require('./routes/index')
const channelRoutes = require('./routes/channels')
const postRoutes = require('./routes/posts')

// Use static file for css, urlencoded for req.body, and methodOverride
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(methodOverride('_method'))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)

// middleware - session config
app.use(
  session({
    store: new MongoStore({
      url: process.env.ATLAS_URI || 'mongodb://localhost:27017/letschat',
    }),
    //secret
    secret: process.env.SECRET || 'anything',
    //resave
    resave: false,
    //saveUninitialized
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 10,
    },
  }),
)

//PASSPORT CONFIGURATION
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

//Facebook Auth
passport.use(
  new FacebookStrategy(
    {
      //This is class constructor argument telling Passport to create a new Facebook Auth Strategy
      clientID: config.facebook_api_key, //The App ID generated when app was created on https://developers.facebook.com/
      clientSecret: config.facebook_api_secret, //The App Secret generated when app was created on https://developers.facebook.com/
      callbackURL: config.callback_url,
      profile: ['id', 'displayName'], // You have the option to specify the profile objects you want returned
    },
    function (accessToken, refreshToken, profile, done) {
      //Check the DB to find a User with the profile.id
      User.findOne({ facebook_id: profile.id }, function (err, user) {
        //See if a User already exists with the Facebook ID
        if (err) {
          console.log(err) // handle errors!
        }

        if (user) {
          done(null, user)
          // If existed User
        } else {
          // else create a new User
          user = new User({
            // pass in fb @params
            facebook_id: profile.id,
            username: profile.displayName,
          })
          user.save(function (err) {
            if (err) {
              console.log(err)
            } else {
              console.log('saving user ...')
              done(null, user)
            }
          })
        }
      })
    },
  ),
)

app.use(passport.initialize())
app.use(passport.session())

//A MIDDLEWARE FOR EVERY ROUTE IN ORDER TO REQ.USER
app.use(function (req, res, next) {
  res.locals.currentUser = req.user
  next()
})

// Use routes
app.use('/', indexRoutes)
app.use('/channel', channelRoutes)
app.use('/channel/:user_id', postRoutes)

const server = setUpSocketBasedChat(app)

server.listen(3000, () => {
  console.log('app is listening on port 3000')
})
