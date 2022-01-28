const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  likedBy: [
    { type: Schema.Types.ObjectId, ref: 'User' }
  ],
  comments: [
    {
      post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
      author: { type: String, required: true },
      text: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

PostSchema
.virtual('likeCount')
.get(function () {
  return this.likedBy.length;
});


module.exports = mongoose.model('Post', PostSchema);