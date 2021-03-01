const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 实例化数据模板
const TeaClassSchema = new Schema({
  user: {     //关联数据表
    type: String,
    ref: 'teachers',
    required: true
  },
  // 院系
  college: {
    type: String,
    required: true
  },
  mclass: [
    {
      classname: {
        type: String,
      },
      place: {
        type: String,
        default: '张衡楼'
      },
      week: {
        type: String,
        required: true
      },
      quantum: {
        type: Number,
        min: 1,
        max: 5
      },
      beginTime: {
        type: String
      },
      endTime: {
        type: String
      }
    }
  ],
})

module.exports = TeaClass = mongoose.model('teaclass', TeaClassSchema)