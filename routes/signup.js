const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');


router.get('/signup', (req, res) => {
  res.render('signup');
});

/******
 Search if user exists already.
 If they don't save them.
 Login user.
 ******/

router.post('/signup',
  [
    body('email', 'Invalid email')
    .trim()
    .isEmail()
    .normalizeEmail(),
    body('password', 'Password must not be empty')
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body('name', 'Name must not be empty')
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body('imgUrl')
      .trim()
      .isURL()
      .optional({ checkFalsy: true }),
    (req, res, next) => {
      const errors = validationResult(req);

      if(!errors.isEmpty()) {
        res.render('signup', { errors: errors.array() })
      } 
      else {
        const password = req.body.password;

        User.findOne({ email: req.body.email }, (err, user) => {
          if (err) { return next(err); }
    
          if (user) {
            res.render('login', { 
              email: user.email,
              message: 'You already have an account!'
            })
          } 
    
          if (!user) {
            const imgUrl = req.body.imgurl || null;

            bcrypt.hash(password, 10, (err, hashedPW) => {
              if (err) { return next(err); }

              const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPW,
                avatar: imgUrl
              });
          
              newUser.save((err, saved) => {
                if (err) { next(err); }
  
                res.render('login', { 
                  email: saved.email
                })
              });
            })

          }
        });
      }
    }
  ]
);

module.exports = router;