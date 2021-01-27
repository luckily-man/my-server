const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 实例化数据模板
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  stuId: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  permission: {
    type: String,
    default: 'user'
  }
})

module.exports = User = mongoose.model('users', UserSchema)