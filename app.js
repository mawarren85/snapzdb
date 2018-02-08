const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const morgan = require('morgan')
const port = process.env.PORT || 8000;

var config = require('./knexfile')['development']
var knex = require('knex')(config)

const bcrypt = require('bcrypt-as-promised')
const passport = require('passport')

var localStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); // test
app.use(cookieParser()); //read cookies (needed for auth)

app.use(morgan('short'));

app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const users = require('./routes/users');
app.use('/users', users);


//checking user/password input against info in the database

passport.use('login', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},
  function(req, email, password, done) {
      console.log(email, 'AM I BREAKING HERE!?!?')
    //find user where email = input email
    knex('users').where('email', email)
    .then(function(results, err) {
      console.log(results, 'RESULTS FROM KNEX')
      if(err) {
        return done(err);
      }
      if(!results[0].email) {
        return done(null, false, req.flash('loginMessage', 'No user found.'));
      }
      //compare hashed password in database against password entered
      bcrypt.compare(password, results[0].hashed_password)
      .then(function(results) {
        if(!results) {
          return done(null, false, req.flash('loginMessage', 'Wrong password.'));
        }
      });
      return done(null, results);
    });
  }
));

//serialize user for the session -- keep them logged in
passport.serializeUser(function(user, done) {
  console.log('i am serializedddddddddddd')
  console.log(user, 'serial user')
  done(null, user);
})

passport.deserializeUser(function(id, done) {
console.log('im deserialized')
  knex('users').where('id', id[0].id)
    .then(function(results) {
      if (results) {
        done(null, results[0].id)
      }
    })
})


// Starting the server/ telling it which port to run on.
app.listen(port, function () {
  console.log(`Listening on port: ${port}`);
});
