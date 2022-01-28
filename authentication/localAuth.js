const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');


/// AUTHENTICATION ///

/// Put this as first argument to new LocalStrategy 
// {
//   usernameField: 'email',
//   passwordField: 'passwd'
// }

passport.use(
  new LocalStrategy({
    usernameField: 'email'
  }, (email, password, done) => {
    /// The user data is stored in the DB from the signup ///
    User.findOne({ email: email }, (err, user) => {
      if (err) { 
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username (email) or no account" });
      }
      if (user) {
        bcrypt.compare(password, user.password, (err, res) => {
          if (err) {
            done(err);
            return;
          } 
          if (res) {
            return done(null, {
              id: user._id.toString(),
              avatar: user.avatar,
              name: user.name
            });
          } else {
            return done(null, false, { message: "Incorrect password"});
          }
        })
      }
    });
  })
);

// These two are only needed when using sessions:
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(err, user);
});

module.exports = passport;