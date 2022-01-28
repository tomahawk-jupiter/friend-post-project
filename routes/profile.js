const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/isAuth');
const User = require('../models/user');
const FriendRequest = require('../models/friendRequest');
const Post = require('../models/post');
const async = require('async');


router.get('/', isAuth, (req, res, next) => {
  async.parallel({
    users: (callback) => {
      User.find({}, callback);
    },
    requests: (callback) => {
      FriendRequest.find({}, callback);
    },
    posts: (callback) => {
      Post.find({}).sort({ timestamp: 'desc'}).exec(callback);
    },
    friendList: (callback) => {
      User.findById(req.user.id, '-_id friends', callback);
    }
  }, (err, results) => {
    if (err) { return next(err); }

    /// Create the data to send to view ///
    const usersArray = [];

    results.users.map((each) => {
      const style = each.friends.includes(req.user.id) ? 'friendImg' : 'notFriendImg';

      const user = {
        id: String(each._id),
        name: each.name,
        avatar: each.avatar,
        acceptBtn: false,
        pending: false,
        style: style
      };
      usersArray.push(user);
    });

    results.requests.map((eachReq) => {
      usersArray.forEach((each) => {
        const to = String(eachReq.to);
        const from = String(eachReq.from);

        if (from === req.user.id && to === each.id) {
          each.pending = true;
        } else if (to === req.user.id && from === each.id) {
          each.acceptBtn = true;
        }
      });
    });

    const list = results.friendList.friends;

    /// Return only friend posts and current user posts ///
    const filteredPosts = results.posts.filter((post) => {
      
      if (list.includes(post.authorId)) {
        return true;
      } else if (post.authorId == req.user.id) {
        return true;
      }
      return false;
    });

    res.render('profile', {
      users: usersArray,
      currentUser: req.user,
      posts: filteredPosts.slice(0, 12)
    });

  });
});

module.exports = router;