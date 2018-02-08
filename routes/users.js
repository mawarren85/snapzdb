const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-as-promised');
var config = require('../knexfile')['development'];
var knex = require('knex')(config);
const passport = require('passport');


router.get('/', (req, res, next) => {
  knex('users')
  .then(function(results) {
    console.log(results, 'hoooray')
  })
})
/*  ====================================================================
  create a new user and add them to the database with info from signup page
====================================================================  */

router.post('/signup', (req, res, next) => {
console.log('helloooooo')
  console.log(req.body, 'THIS IS REQ FROM THE PHONNNE')

  bcrypt.hash(req.body.password, 12)
    .then((hashed_password) => {

      return knex('users')
        .insert({
          name: req.body.name,
          email: req.body.email,
          hashed_password: hashed_password,
          profile_photo: req.body.profile_photo
        }, '*');
    })
    .then((users) => {
      const user = users[0];
      delete user.hashed_password;
      console.log('successssssss!!!!!!!!!!!!!!!!')
      console.log(user, 'SINGLE USER')

      //res.render('created');
    })
    .catch((err) => {
      next(err);
    });
});





/*
====================================================================
  create a new user and add them to the database with info from signup page
====================================================================  */
router.post('/login', passport.authenticate('login'), function(req, res){
console.log('helloooooo')
  // console.log(req.body, 'THIS IS REQ FROM THE PHONNNE')
  //
  // bcrypt.hash(req.body.password, 12)
  //   .then((hashed_password) => {
  //
  //     return knex('users')
  //       .insert({
  //         name: req.body.name,
  //         email: req.body.email,
  //         hashed_password: hashed_password,
  //         profile_photo: req.body.profile_photo
  //       }, '*');
  //   })
  //   .then((users) => {
  //     const user = users[0];
  //     delete user.hashed_password;
  //     console.log('successssssss!!!!!!!!!!!!!!!!')
  //     console.log(users, 'userssssssssssssss')
  //     console.log(user, 'SINGLE USER')
  //     console.log(req.session.passport.user.id, 'SEESSSSION IDDDDDDDDDDD')
  //     //res.render('created');
  //   })
  //   .catch((err) => {
  //     next(err);
  //   });
});

/*  ====================================================================
        get logout page when user ends their session
====================================================================  */

router.get('/logout', function(req, res) {
  req.logout();
  console.log(req.session.passport, 'AFTER LOGOUT');
  res.render('logout', {
    user: req.session.passport.user
  });
});


/*  ====================================================================
        route middleware function to make sure user is logged in
====================================================================  */

function isLoggedIn(req, res, next) {

  //if user is authenticated in the session, cowabunga
  if (req.isAuthenticated())
    console.log(req.user, 'i am authenticated');
  return next();

  // if they aren't redirect to login page
  console.log('failllll you arent logged in');
  res.redirect('/users/login');
}




router.use(function(req, res) {
  res.set('Content-Type', 'text/plain');
  res.sendStatus(404);
});


module.exports = router;
