const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')


//Get home page
router.get("/", (req, res) => {
    res.render("index/home", {user: req.user})
})

//Handle local login logic
router.post("/login", passport.authenticate("local"),
   function(req, res){
        res.redirect("/channel/" + req.user.id + "/main")
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

// router.get('/channel/interests', ensureAuthenticated, function(req, res){
//     res.render('channels/interests/', { user: req.user });
//   });
  
router.get('/auth/facebook', passport.authenticate('facebook',{scope:'email'}));


  
router.get('/auth/facebook/callback',
    passport.authenticate('facebook'),
    function(req, res) {
        if(req.user.interests.length === 0){
            res.redirect("/channel/interests/" + req.user.id)
        } else {
            res.redirect("/channel/" + req.user.id + "/main") 
        } 
    });
  
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

//////////////////////////////////////////GOOGLE LOGIC////////////////////////////////

// router.get('/auth/google', 
//   passport.authenticate('google', { scope : ['profile', 'email'] }));
 
// router.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/error' }),
//   function(req, res) {
//     // Successful authentication, redirect success.
//     res.redirect('/success');
//   });


//Logout route
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router
