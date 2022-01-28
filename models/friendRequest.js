const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendRequestSchema = new Schema({
  to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, default: null }
});

module.exports = mongoose.model('FriendRequest', FriendRequestSchema);