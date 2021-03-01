const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 实例化数据模板
const AllClsSchema = new Schema({
  college: {
    type: String,
    required: true
  },
  course: [
    {
      name:{
        type: String,
        required: true
      },
      teacher: {
        type: String,
        required: true
      },
      classRoom: {
        type: String,
        required: true
      },
      week: {
        type: String,
        required: true
      },
      quantum: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      begin: {
        type: String,
        required: true
      },
      end: {
        type: String,
        required: true
      },
      students: [
        {
          stuName: {
            type: String,
          },
          stuId: {
            type: Number,
          },
          ontime: [
            {
              place: {
                type: String,
                default: '张衡楼'
              },
              date: {
                type: String,
                default: '01-01'
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
    }
  ]
  
})

module.exports = AllCls = mongoose.model('allcls', AllClsSchema)