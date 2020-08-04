const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')

//Get home/root page
router.get('/', (req, res) => {
  res.render('index/home', { user: req.user })
})

//Handle local login logic
router.post('/login', passport.authenticate('local'), function (req, res) {
  res.redirect('/channel/' + req.user.id)
})

//Get register page
router.get('/register', (req, res) => {
  res.render('index/register')
})

//Handle register logic
router.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username })
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err)
      return res.render('index/register')
    }
    passport.authenticate('local')(req, res, function () {
      res.redirect('/channel/interests/' + req.user.id)
    })
  })
})

////////////////////////////////////////FACEBOOK AUTH///////////////////////////////////

router.get('/account', ensureAuthenticated, function (req, res) {
  res.render('account', { user: req.user })
})

router.get(
  '/auth/facebook',
  passport.authenticate('facebook', { scope: 'email' }),
)

router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook'),
  function (req, res) {
    if (req.user.interests.length === 0) {
      res.redirect('/channel/interests/' + req.user.facebook_id)
    } else {
      res.redirect('/channel/' + req.user.facebook_id)
    }
  },
)

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

//Logout route
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router
