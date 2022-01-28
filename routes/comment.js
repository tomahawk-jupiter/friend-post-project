const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const isAuth = require('../middleware/isAuth');
const { body, validationResult } = require('express-validator');


router.post(
  '/post/comment', 
  isAuth, 
  body('postId').trim().isAlphanumeric().escape(),
  body('name').trim().escape(),
  body('commentText', 'Comment must not be empty').trim().notEmpty().escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json({ errors: errors.array() });
    } 
    else {
      const newComment = {
        post: req.body.postId,
        author: req.user.name,
        text: req.body.commentText
      }
  
      Post.findByIdAndUpdate(
        req.body.postId, 
        { $push: { comments: newComment } }, 
        { new: true }, 
        (err, updated) => {
          if (err) { return next(err); }
          if (updated) {
            res.json(newComment);
          }
        }
      );
    }
  }
);

module.exports = router;