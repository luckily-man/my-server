const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 实例化数据模板
const StudentSchema = new Schema({
  teacher: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  classRoom: {
    type: String,
    default: '张衡楼'
  },
  week: {
    type: String,
  },
  quantum: {
    type: Number,
    min: 1,
    max: 5
  },
  begin: {
    type: String
  },
  end: {
    type: String
  },
  students: [
    {
      name: {
        type: String,
        required: true
      },
      stuId: {
        type: Number,
        required: true
      },
      ontime: [
        {
          date: {
            type: String,
            default: ''
          },
          beginTime: {
            type: String,
            default: '没有签到'
          },
          endTime: {
            type: String,
            default: '没有签退'
          }
        }
      ]
      
    }
  ]
})

module.exports = Student = mongoose.model('student', StudentSchema)