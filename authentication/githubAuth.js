const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const User = require('../models/user');


/// Serialize the user profile into the session ///
passport.serializeUser((user, cb) => {
  cb(null, user);
});

/// Deserialize the user ///
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    /// Find or save the authenticated user ///

    if (profile._json.email) {
      // If github profile contains email use it to search DB,
      // gives a chance to retreive user if they used signup form previously.
      User.findOne({ email: profile._json.email }, (err, user) => {
        if (err) { return console.log(err); }

        cb(null, {
          id: user._id.toString(),
          avatar: user.avatar,
          name: user.name
        });
      });
    } else {
      // No email in github to attempt to retreive user.
      // Attempt to retreive with githubId OR save new user.
      User.findOne({ githubId: profile.id }, (err, user) => {
        if (err) { console.log(err); }
        if (!user) {
          // No user found with githubId, save user.

          const user = new User({
            githubId: String(profile._json.id),
            avatar: profile._json.avatar_url,
            name: profile.username,
            email: profile._json.email
          });

          user.save((err, savedUser) => {
            if (err) { console.log(err); }
            cb(null, {
              id: savedUser._id.toString(),
              avatar: savedUser.avatar,
              name: savedUser.name
            });
          });
        }

        if (user) {
          cb(null, {
            id: user._id.toString(),
            avatar: user.avatar,
            name: user.name
          });
        }
      });
    }
  }
));

module.exports = passport;