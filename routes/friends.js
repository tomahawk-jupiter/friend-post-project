const express = require('express');
const router = express.Router();
const FriendRequest = require('../models/friendRequest');
const User = require('../models/user');
const async = require('async');
const isAuth = require('../middleware/isAuth');
const { body, validationResult } = require('express-validator');


router.post(
  '/friend/makeRequest', 
  isAuth, 
  body('friendId').trim().isAlphanumeric().escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      res.json({ errors: errors.array() });
    } else {
      const friendRequest = new FriendRequest({
        to: req.body.friendId,
        from: req.user.id
      });
  
      friendRequest.save((err, saved) => {
        if (err) { return next(err); }
        if (saved) {
          res.json({ successful: true });
        }
      });
    }
  }
);

/// Add friend to both sides of the friend request, then delete request from db.
router.post(
  '/friend/accept', 
  isAuth, 
  body('friendId').trim().isAlphanumeric().escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      res.json({ errors: errors.array() });
    } else {
      const friendId = req.body.friendId;
      const userId = req.user.id
  
      async.parallel({
        addToUser: (callback) => {
          User.findByIdAndUpdate(userId, { $push: { friends: friendId }}, callback);
        },
        addToFriend: (callback) => {
          User.findByIdAndUpdate(friendId, { $push: { friends: userId }}, callback);
        },
        delete: (callback) => {
          FriendRequest.findOneAndDelete({ from: friendId }, callback);
        }
      }, (err, results) => {
        if (err) { return next(err); }
        if (results) {
          res.json({ successful: true });
        }
      });
    }
  }
);

module.exports = router;