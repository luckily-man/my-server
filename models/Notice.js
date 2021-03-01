const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 实例化数据模板
const NoticeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
})

module.exports = Notice = mongoose.model('nitices', NoticeSchema)