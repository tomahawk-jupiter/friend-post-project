const express = require('express');
const router = express.Router();

const passport = require('passport');
const { body, validationResult } = require('express-validator');


/// Invalidates the session on server side (googled anwser) ///
router.post('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

/// Login link goes to this route ///
router.get('/auth/github',
  passport.authenticate('github'));

/// Github strategy calls this route ///
router.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    
    /// Successful authentication go to profile page ///
    res.redirect('/');
  });

// Add form validation with express-validation
router.post('/', [
  body('email', 'Invalid email')
    .trim()
    .isEmail()
    .normalizeEmail(),
  body('password', 'Password must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape()
  ], 
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('login', { errors: errors.array() });
    } else {
      next();
    }
},
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true
  })
);

module.exports = router;