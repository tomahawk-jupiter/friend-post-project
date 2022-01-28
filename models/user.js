const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, default: null },
  email: { type: String, default: null },
  password: { type: String, default: null },
  githubId: { type: String, default: null },
  avatar: { type: String, default: null },
  friends: [
    { type: Schema.Types.ObjectId, ref: 'User', default: null }
  ]
});

module.exports = mongoose.model('User', UserSchema);