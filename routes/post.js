const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const isAuth = require('../middleware/isAuth');
const { body, validationResult } = require('express-validator');


/// Save the post in db and send back as json ///

router.post(
  '/post', 
  isAuth, 
  body('postMessage', 'Post message must not be empty')
    .trim()
    .notEmpty()
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json({ errors: errors.array() });
    } else {
      const post = new Post({
        authorId: req.user.id,
        authorName: req.user.name,
        text: req.body.postMessage
      });
  
      post.save((err, saved) => {
        if (err) { return next(err); }
        if (saved) {
          res.json(saved);
        }
      });
    }
  }
);

/// Add or remove like from post ///
router.post(
  '/post/like', 
  isAuth, 
  body('postId', 'postId must be alphanumeric')
    .trim()
    .isAlphanumeric()
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      res.json({ errors: errors.array() });
    } 
    else {
      Post.findById(req.body.postId, (err, post) => {
        if (err) { return next(err); }
  
        if (post.likedBy.includes(req.user.id)) {
          Post.findByIdAndUpdate(
            req.body.postId,
            { $pull: { likedBy: req.user.id } },
            { new: true },
            (err, updated) => {
              if (err) { return next(err); }
              res.json({ likeCount: updated.likeCount });
            }
          );
        } else {
          Post.findByIdAndUpdate(
            req.body.postId,
            { $push: { likedBy: req.user.id } },
            { new: true },
            (err, updated) => {
              if (err) { return next(err); }
              res.json({ likeCount: updated.likeCount });
            }
          );
        }
      });
    }
  }
);

module.exports = router;
