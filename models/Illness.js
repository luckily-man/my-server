const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 实例化数据模板
const IllnessSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  stuId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: '事假'
  },
  beginDate: {
    type: String,
    required: true
  },
  endDate: {
    type:String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
})

module.exports = Illness = mongoose.model('illness', IllnessSchema)